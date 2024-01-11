<script lang="ts">
	import FeedbackButton from '$lib/buttons/FeedbackButton.svelte';
	import { getDateDay, isSameDate } from '../../utils/helpersDate';
	import { calculateNextInterval, setNextRepetition } from '../../utils/intervals';
	import type { UserResponse } from '../../utils/intervals';

	import CardBackButton from '$lib/buttons/CardBackButton.svelte';

	let isSide1 = true;
	export let card: Card;
	export let totalCards: number;
	export let cardsRemaining: number;
	export let reviewHistory: Card[];
	export let setNextCard = (): void => {};
	export let undo = (): void => {};
	export let setCardCompletion = (cardId: number, completed: boolean): void => {};
	export let updateCardInDatabase = (
		cardId: number,
		updatedIntervals: number[],
		updatedRepHistory: string[]
	): void => {};

	function toggleSide() {
		isSide1 = !isSide1;
	}

	// remove card from review if it doesn't show again

	function updateCard(response: UserResponse) {
		const now = new Date();
		reviewHistory.push(card);
		const intervalHistory = card.intervals_min ?? [];
		const repetitionHistory = card.repetition_history ?? [];
		const nextInterval = calculateNextInterval(intervalHistory, repetitionHistory, response);
		const nextRepetition = setNextRepetition(nextInterval);
		const repeatsToday = isSameDate(new Date(nextRepetition), now);
		if (!repeatsToday) {
			setCardCompletion(card.id, true);
		}
		updateCardInDatabase(
			card.id,
			intervalHistory.concat(nextInterval),
			repetitionHistory.concat(nextRepetition)
		);
		setNextCard();
		isSide1 = true;
	}
</script>

<div class="flex md:border-2 md:rounded-lg w-full h-full">
	<CardBackButton {undo} />

	<div class="flex flex-col w-full p-4">
		<div
			class="text-2xl md:text-3xl font-bold h-full items-center mx-auto"
			on:click={toggleSide}
			on:keydown={toggleSide}
			role="button"
			tabindex="0"
		>
			<div class="mt-20 px-1 md:px-4 text-center">
				{#if isSide1}
					{card.side_1}
				{:else}
					<div>{card.side_1}</div>
					<hr class="my-20" />
					<div>{card.side_2}</div>
				{/if}
			</div>
		</div>
		{#if !isSide1}
			<div class="flex flex-grow-0 justify-between md:p-4 gap-1 md:gap-10">
				<FeedbackButton updateCard={() => updateCard('BAD')} buttonColor="red" text="Bad" />
				<FeedbackButton updateCard={() => updateCard('HARD')} buttonColor="yellow" text="Hard" />
				<FeedbackButton updateCard={() => updateCard('GOOD')} buttonColor="green" text="Good" />
				<FeedbackButton updateCard={() => updateCard('EASY')} buttonColor="blue" text="Easy" />
			</div>
		{:else}
			<div class="text-center mt-4">
				<p class="text-gray-500">{cardsRemaining} of {totalCards} remaining</p>
			</div>
		{/if}
	</div>
</div>
