<script lang="ts">
	import FeedbackButton from '$lib/buttons/FeedbackButton.svelte';
	import { getDateDay, toJsDateType, isSameDate } from '../../utils/helpersDate';
	import { calculateNextInterval, setNextRepetition } from '../../utils/intervals';
	import type { UserResponse } from '../../utils/intervals';

	import CardBackButton from '$lib/buttons/CardBackButton.svelte';

	let isSide1 = true;
	export let cardsRemaining: number;
	export let nextCard = (): void => {};
	export let previousCard = (): void => {};
	export let removeCardFromReview = (cardId: string): void => {};
	export let updateCardStatusInDatabase = (
		numRepetitions: number,
		interval_minutes: number,
		nextRepetition: string
	): void => {};

	export let card: Card;

	function toggleSide() {
		isSide1 = !isSide1;
	}

	// remove card from review if it doesn't show again

	function updateCard(response: UserResponse) {
		const now = new Date();
		const nowDay = getDateDay(now);
		const newInterval = calculateNextInterval(card.interval_min, card.num_repetitions, response);
		const nextRepetition = setNextRepetition(newInterval);
		const repeatsToday = isSameDate(new Date(nextRepetition), now);
		if (!repeatsToday) {
			removeCardFromReview(card.id);
		}
		updateCardStatusInDatabase(card.num_repetitions + 1, newInterval, nextRepetition);
		nextCard();
		isSide1 = true;
	}
</script>

<div class="flex border-2 rounded-lg w-full absolute bottom-0 top-20">
	<CardBackButton {previousCard} />

	<div class="flex flex-col w-full">
		<div
			class="text-3xl font-bold h-full items-center mx-auto"
			on:click={toggleSide}
			on:keydown={toggleSide}
			role="button"
			tabindex="0"
		>
			<div class="mt-20">
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
			<div class="flex justify-between p-4 gap-10">
				<FeedbackButton updateCard={() => updateCard('BAD')} buttonColor="red" text="Bad" />
				<FeedbackButton updateCard={() => updateCard('HARD')} buttonColor="yellow" text="Hard" />
				<FeedbackButton updateCard={() => updateCard('GOOD')} buttonColor="green" text="Good" />
				<FeedbackButton updateCard={() => updateCard('EASY')} buttonColor="blue" text="Easy" />
			</div>
		{:else}
			<div class="text-center mt-4">
				<p class="text-gray-500">Cards Remaining: {cardsRemaining}</p>
			</div>
		{/if}
	</div>
</div>
