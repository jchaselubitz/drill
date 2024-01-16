<script lang="ts">
	import FlashCard from '$lib/decks/FlashCard.svelte';
	import LessonControlBar from '$lib/lesson/LessonControlBar.svelte';
	import LessonSettings from '$lib/lesson/LessonSettings.svelte';
	import type { Card, CardRef } from '$src/types/primaryTypes';

	import type { PageData } from './$types';
	export let data: PageData;
	let currentCardIndex = 0;
	$: ({ supabase, session, lesson, reviewDeckDict, reviewDeckCards } = data);
	$: userId = session?.user?.id;
	$: currentCard = reviewDeckCards[currentCardIndex];
	$: uncompletedCardRefs = reviewDeckDict.filter((cardRef: CardRef) => cardRef.completed === false);
	$: reviewHistory = [] as Card[];
	$: showLessonSettings = false;
	$: showSide2First = lesson.show_side_2_first;

	async function setCardCompletion(cardId: number, completed: boolean) {
		const updatedReviewDeckDict = reviewDeckDict.map((cardRef: CardRef) => {
			return cardRef.id === cardId ? { ...cardRef, completed: completed } : cardRef;
		});
		const { error } = await supabase
			.from('lessons')
			.update({ review_deck: updatedReviewDeckDict })
			.eq('id', lesson.id);
		if (error) {
			throw Error(`${'Failed to remove card from review:'} ${error.message}`);
		}
		if (completed) {
			const indexOfCard = uncompletedCardRefs.findIndex(
				(cardRef: CardRef) => cardRef.id === cardId
			);
			uncompletedCardRefs = uncompletedCardRefs.toSpliced(indexOfCard, 1);
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
		const updatedRepHistory =
			repetitionHistory && repetitionHistory?.length > 0 ? repetitionHistory.slice(0, -1) : [];
		const updatedIntervals =
			intervalsMin && intervalsMin?.length > 0 ? intervalsMin.slice(0, -1) : [];
		setCardCompletion(previousCard.id, false);
		updateCardInDatabase(previousCard.id, updatedIntervals, updatedRepHistory);
		reviewHistory.pop();
		currentCardIndex = reviewDeckCards.findIndex((cardRef) => cardRef.id === previousCard.id);
	}
</script>

<svelte:head>
	<title>{lesson.title}</title>
</svelte:head>

<div class="m-4rounded-lg flex flex-col h-full">
	<LessonControlBar {lesson} bind:showLessonSettings />
	{#if showLessonSettings}
		<LessonSettings {lesson} {userId} {supabase} />
	{:else if currentCard}
		<div class="flex justify-center w-full h-full mt-4">
			<FlashCard
				card={currentCard}
				totalCards={reviewDeckDict.length}
				cardsRemaining={uncompletedCardRefs.length}
				{showSide2First}
				{reviewHistory}
				{setNextCard}
				{undo}
				{setCardCompletion}
				{updateCardInDatabase}
				{supabase}
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
