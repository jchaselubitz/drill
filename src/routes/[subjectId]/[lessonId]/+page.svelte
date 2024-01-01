<script lang="ts">
	import FlashCard from '$lib/decks/FlashCard.svelte';

	import type { PageData } from './$types';
	export let data: PageData;
	$: ({ supabase, lesson, reviewDeck } = data);
	$: currentCard = reviewDeck[currentCardIndex];

	$: console.log('lesson', lesson);

	async function removeCardFromReview(cardId: string) {
		const cardRefs = reviewDeck.map((card) => card.id);
		const newCardList = cardRefs.filter((id) => id !== cardId);
		const { data, error } = await supabase
			.from('lessons')
			.update({ review_deck: newCardList })
			.eq('id', lesson.id);
		if (error) {
			throw Error(`${'Failed to remove card from review:'} ${error.message}`);
		}
		reviewDeck = reviewDeck.filter((card) => card.id !== cardId);
	}

	async function updateCardStatusInDatabase(
		numRepetitions: number,
		interval_minutes: number,
		nextRepetition: string
	) {
		const { data, error } = await supabase
			.from('cards')
			.update({
				num_repetitions: numRepetitions,
				interval_min: interval_minutes,
				next_repetition: nextRepetition
			})
			.eq('id', currentCard.id);
		if (error) {
			throw Error(`${'Failed to update card status:'} ${error.message}`);
		}
	}

	let currentCardIndex = 0;
	function nextCard() {
		currentCardIndex = currentCardIndex + 1 === reviewDeck.length ? 0 : currentCardIndex + 1;
	}

	function previousCard() {
		currentCardIndex = (currentCardIndex - 1 + reviewDeck.length) % reviewDeck.length;
	}
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

<div class="m-4rounded-lg flex flex-col h-full">
	<h1 class="text-2xl font-bold">{lesson.title}</h1>

	{#if currentCard}
		<div class="flex justify-center w-full h-full">
			<FlashCard
				card={currentCard}
				cardsRemaining={reviewDeck.length}
				{nextCard}
				{previousCard}
				{removeCardFromReview}
				{updateCardStatusInDatabase}
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
