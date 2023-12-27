<script lang="ts">
	import { fragment, graphql } from '$houdini';
	import FeedbackButton from '$lib/buttons/FeedbackButton.svelte';
	import { UPDATE_CARD_INTERVAL } from '$lib/graphql/lesson';
	import { getDateDay, toJsDateType, isSameDate } from '../../utils/helpersDate';
	import { calculateNextInterval, setNextRepetition } from '../../utils/intervals';
	import type { UserResponse } from '../../utils/intervals';
	import type { Card } from '$houdini';
	import CardBackButton from '$lib/buttons/CardBackButton.svelte';

	let isSide1 = true;
	export let nextCard = (): void => {};
	export let previousCard = (): void => {};
	export let removeCardFromReview = (cardId: string): void => {};

	export let card: Card;
	$: data = fragment(
		card,
		graphql(`
			fragment Card on Card {
				id
				side1
				side2
				numRepetitions
				interval
				nextRepetition
				status
				lesson {
					id
				}
			}
		`)
	);

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
					{card.side1}
				{:else}
					<div>{card.side1}</div>
					<hr class="my-20" />
					<div>{card.side2}</div>
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
		{/if}
	</div>
</div>
