<script lang="ts">
	import FlashCard from '$lib/decks/FlashCard.svelte';
	import type { PageData } from './$houdini';
	export let data: PageData;
	// export async function load({ fetch, params }) {
	// 	const { subjectId, lessonId } = params;
	// 	console.log('subjectId', subjectId);
	// 	// Use 'fetch' to call your GraphQL endpoint or Houdini's fetch function
	// 	// Fetch the necessary data using subjectId and lessonId
	// 	// Return the data to the component
	// }
	$: console.log('data', data);
	$: ({ GetLesson } = data);
	$: lesson = $GetLesson.data.getLesson;

	let currentCardIndex = 0;

	function nextCard() {
		currentCardIndex = (currentCardIndex + 1) % lesson.cardDeck.length;
	}

	function previousCard() {
		currentCardIndex = (currentCardIndex - 1 + lesson.cardDeck.length) % lesson.cardDeck.length;
	}

	$: currentCard = lesson.cardDeck[currentCardIndex];
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

<div class="m-4 bg-gray-100 rounded-lg flex flex-col items-center">
	<h1 class="text-2xl font-bold">{lesson.title}</h1>
	<h2 class="text-xl font-bold">level: {lesson.subject.currentLevel}</h2>

	<div class="flex justify-center">
		<button on:click={previousCard} class="p-2 m-2 bg-blue-500 text-white rounded-lg"
			>Previous</button
		>
		<FlashCard card={currentCard} click={nextCard} />
	</div>
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme('colors.white');
	}
</style>
