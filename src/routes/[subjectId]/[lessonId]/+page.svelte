<script lang="ts">
	import FlashCard from '$lib/decks/FlashCard.svelte';
	import type { PageData } from './$houdini';
	export let data: PageData;
	$: ({ GetLesson } = data);
	$: lesson = $GetLesson.data.getLesson;
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

<div class="m-4 bg-gray-100 rounded-lg">
	<h1 class="text-2xl font-bold">{lesson.title}</h1>
	<h2 class="text-xl font-bold">level: {lesson.subject.currentLevel}</h2>

	{#each lesson.cardDeck as card}
		<div class="flex flex-col">
			<FlashCard {card} />
		</div>
	{/each}
</div>

<!-- <div>
	<LessonCreation />
</div> -->

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.white);
	}
</style>
