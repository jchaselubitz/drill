<script lang="ts">
	import { invalidate } from '$app/navigation';
	import DeckList from '$lib/decks/DeckList.svelte';
	import FlashCard from '$lib/decks/FlashCard.svelte';
	import { downloadCSV } from '$src/utils/helpersExport';

	import type { PageData } from './$types';
	export let data: PageData;
	let currentCardIndex = 0;
	$: ({ supabase, lesson, reviewDeckDict, reviewDeckCards } = data);
	$: currentCard = reviewDeckCards[currentCardIndex];
	$: uncompletedCardRefs = reviewDeckDict.filter((cardRef) => !cardRef.completed);
	$: reviewHistory = [];
	$: showLessonSettings = false;

	function toggleLessonSettings() {
		showLessonSettings = !showLessonSettings;
	}

	async function setCardCompletion(cardId: number, completed: boolean) {
		const updatedReviewDeckDict = reviewDeckDict.map((cardRef) => {
			return cardRef.id === cardId ? { ...cardRef, completed: completed } : cardRef;
		});
		const { error } = await supabase
			.from('lessons')
			.update({ review_deck: updatedReviewDeckDict })
			.eq('id', lesson.id);
		if (error) {
			throw Error(`${'Failed to remove card from review:'} ${error.message}`);
		}
	}

	async function updateCardInDatabase(
		cardId: number,
		updatedIntervals: number[],
		updatedRepHistory: string[]
	) {
		const { data, error } = await supabase
			.from('cards')
			.update({
				intervals_min: updatedIntervals,
				repetition_history: updatedRepHistory
			})
			.eq('id', cardId);

		if (error) {
			throw Error(`${'Failed to update card status:'} ${error.message}`);
		}
		invalidate('app:cardUpdate');
	}

	function setNextCard() {
		currentCardIndex =
			currentCardIndex + 1 === uncompletedCardRefs.length ? 0 : currentCardIndex + 1;
	}

	function undo() {
		if (reviewHistory.length === 0) {
			alert('No cards to undo');
			return;
		}
		const previousCard = reviewHistory[reviewHistory.length - 1];
		const repetitionHistory = previousCard.repetition_history;
		const intervalsMin = previousCard.intervals_min;
		const updatedRepHistory = repetitionHistory?.length > 0 ? repetitionHistory.slice(0, -1) : [];
		const updatedIntervals = intervalsMin?.length > 0 ? intervalsMin.slice(0, -1) : [];
		setCardCompletion(previousCard.id, false);
		updateCardInDatabase(previousCard.id, updatedIntervals, updatedRepHistory);
		reviewHistory.pop();
		currentCardIndex = reviewDeckCards.findIndex((cardRef) => cardRef.id === previousCard.id);
	}
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

<div class="m-4rounded-lg flex flex-col h-full">
	<div class="flex justify-between">
		<h1 class="text-2xl font-bold">{lesson.title}</h1>
		<button
			class="p-1 px-2 bg-blue-600 text-white text-xs rounded-full"
			on:click={toggleLessonSettings}
		>
			{#if showLessonSettings}
				Hide Lesson Settings
			{:else}
				Show Lesson Settings
			{/if}
		</button>

		<button
			class="p-1 px-2 bg-blue-600 text-white text-xs rounded-full"
			on:click={() => downloadCSV(lesson)}>Download CSV</button
		>
	</div>
	{#if showLessonSettings}
		<div class="flex flex-col">
			<div class="flex flex-col">
				<label for="title">Title</label>
				<input
					type="text"
					name="title"
					id="title"
					value={lesson.title}
					class="border-2 border-gray-300 rounded-md"
				/>
			</div>

			<DeckList cards={lesson.cards} />
		</div>
	{:else if currentCard}
		<div class="flex justify-center w-full h-full mt-4">
			<FlashCard
				card={currentCard}
				totalCards={reviewDeckDict.length}
				cardsRemaining={uncompletedCardRefs.length}
				{reviewHistory}
				{setNextCard}
				{undo}
				{setCardCompletion}
				{updateCardInDatabase}
			/>
		</div>
	{:else}
		<div class="flex justify-center w-full h-full">
			<div class="flex flex-col justify-center items-center">
				<h1 class="text-2xl font-bold">No cards to review</h1>
			</div>
		</div>
	{/if}
</div>

<!-- <style lang="postcss">
	:global(html) {
		background-color: theme('colors.white');
	}
</style> -->
