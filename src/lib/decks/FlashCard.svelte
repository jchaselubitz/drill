<script lang="ts">
	import FeedbackButton from '$lib/components/buttons/FeedbackButton.svelte';
	import { UPDATE_CARD_INTERVAL } from '$lib/graphql/lesson';
	import { getDateDay, toJsDateType, isSameDate } from '../../utils/helpersDate';
	import { calculateNextInterval, setNextRepetition } from '../../utils/intervals';
	import type { UserResponse } from '../../utils/intervals';

	let isSide1 = true;
	export let nextCard = (): void => {};
	export let previousCard = (): void => {};
	export let removeCardFromReview = (cardId: string): void => {};
	export let card: {
		id: string;
		side1: string;
		side2: string;
		cardStatus: string;
		nextRepetition: string;
		interval: number;
		numRepetitions: number;
	};

	function toggleSide() {
		isSide1 = !isSide1;
	}

	// remove card from review if it doesn't show again

	async function updateCardStatusInDatabase(
		numRepetitions: number,
		interval: number,
		nextRepetition: string
	) {
		try {
			const response = await UPDATE_CARD_INTERVAL.mutate({
				cardId: card.id,
				numRepetitions: numRepetitions,
				interval: interval,
				nextRepetition: nextRepetition
			});
			console.log('response:', response);
		} catch (error: any) {
			console.log('error:', error);
			throw Error('Failed to update card status:', error);
		}
	}

	function updateCard(response: UserResponse) {
		const now = new Date();
		const nowDay = getDateDay(now);
		const currentRepDate = toJsDateType(card.nextRepetition);
		const newInterval = calculateNextInterval(card.interval, card.numRepetitions, response);
		const nextRepetition = setNextRepetition(newInterval, currentRepDate);
		const repeatsToday = isSameDate(getDateDay(new Date(nextRepetition)), nowDay);
		if (!repeatsToday) {
			removeCardFromReview(card.id);
		}
		updateCardStatusInDatabase(card.numRepetitions + 1, newInterval, nextRepetition);
		nextCard();
		isSide1 = true;
	}
</script>

<div class="flex border-2 rounded-lg w-full p-2 absolute bottom-0 top-20">
	<button on:click={previousCard} class="p-2 bg-blue-500 text-white rounded-lg"
		><svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fill-rule="evenodd"
				d="M10.707 3.293a1 1 0 010 1.414L6.414 9H16a1 1 0 010 2H6.414l4.293 4.293a1 1 0 01-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z"
				clip-rule="evenodd"
			/>
		</svg></button
	>

	<div class="flex flex-col w-full">
		<div
			class="text-3xl font-bold h-full items-center mx-auto"
			on:click={toggleSide}
			on:keydown={toggleSide}
			role="button"
			tabindex="0"
		>
			{#if isSide1}
				<div class="side1">
					<p>{card.side1}</p>
				</div>
			{:else}
				<div class="side2">
					<p>{card.side2}</p>
				</div>
			{/if}
		</div>
		{#if !isSide1}
			<div class="flex justify-between p-4 gap-10">
				<FeedbackButton updateCard={() => updateCard('BAD')} buttonColor="red" text="Bad" />
				<FeedbackButton updateCard={() => updateCard('HARD')} buttonColor="yellow" text="Hard" />
				<FeedbackButton updateCard={() => updateCard('GOOD')} buttonColor="green" text="Good" />
				<FeedbackButton updateCard={() => updateCard('EASY')} buttonColor="blue" text="Easy" />
			</div>
		{/if}
	</div>
</div>
