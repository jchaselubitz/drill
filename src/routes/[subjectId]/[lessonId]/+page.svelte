<script lang="ts">
	import FlashCard from '$lib/decks/FlashCard.svelte';
	import { getDateDay, isSameDate, toDbDate, toJsDateType } from '../../../utils/helpersDate';
	import { createReviewDeck } from '../../../utils/intervals';
	import type { PageData } from './$houdini';
	import { REMOVE_CARD_FROM_REVIEW } from '$lib/graphql/lesson';
	import { graphql } from '$houdini';

	export let data: PageData;
	$: ({ GetLesson } = data);
	$: lesson = $GetLesson.data.getLesson;
	$: cards = lesson.cards;
	$: reviewDeck = lesson.reviewDeck;
	$: console.log('reviewDeck:', reviewDeck);
	$: reviewDate = toJsDateType(lesson.reviewDate);

	const CREATE_REVIEW = graphql`
		mutation CreateReview($lessonId: [ID!], $reviewDeck: [CardRef], $reviewDate: DateTime!) {
			updateLesson(
				input: {
					filter: { id: $lessonId }
					set: { reviewDeck: $reviewDeck, reviewDate: $reviewDate }
				}
			) {
				lesson {
					id
					reviewDeck {
						nextRepetition
						side1
						side2
						interval
						numRepetitions
						id
					}
					reviewDate
				}
			}
		}
	`;

	export async function load({ fetch }) {
		const todayDate = getDateDay(new Date());
		if (!!reviewDeck && isSameDate(getDateDay(reviewDate), todayDate)) {
			return { props: { lesson: { reviewDeck } } };
		}
		const deck = createReviewDeck({ reviewDeck, cards, max_new_cards: 5, max_cards: 40 });
		const cardRefs = deck.map((card) => ({ id: card.id }));
		try {
			await CREATE_REVIEW.mutate(
				{
					id: lesson.id,
					reviewDeck: cardRefs,
					reviewDate: toDbDate(todayDate)
				},
				{ fetch }
			);
		} catch (error: any) {
			console.log('error:', error);
			throw Error('Failed to create review:', error);
		}
		return { props: { lesson: { reviewDeck } } };
	}

	async function removeCardFromReview(cardId: string) {
		try {
			await REMOVE_CARD_FROM_REVIEW.mutate({
				lessonId: lesson.id,
				cardId
			});
		} catch (error: any) {
			console.log('error:', error);
			throw Error('Failed to remove card from review:', error);
		}
	}

	let currentCardIndex = 0;
	function nextCard() {
		currentCardIndex = currentCardIndex + 1 === reviewDeck.length ? 0 : currentCardIndex + 1;
	}

	function previousCard() {
		currentCardIndex = (currentCardIndex - 1 + reviewDeck.length) % reviewDeck.length;
	}

	$: currentCard = reviewDeck[currentCardIndex];
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

<div class="m-4rounded-lg flex flex-col h-full">
	<h1 class="text-2xl font-bold">{lesson.subject.currentLevel} | {lesson.title}</h1>

	{#if currentCard}
		<div class="flex justify-center w-full h-full">
			<FlashCard card={currentCard} {nextCard} {previousCard} {removeCardFromReview} />
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
