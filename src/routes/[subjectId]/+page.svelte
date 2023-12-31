<script lang="ts">
	import LessonCard from '$lib/lesson/LessonCard.svelte';

	export let data;
	$: ({ subject, lessons } = data);
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

{#if subject}
	<div class="m-4rounded-lg">
		<h1 class="text-2xl font-bold">{subject.name} {subject.current_level}</h1>

		{#each lessons ?? [] as lesson}
			<div class="flex flex-col">
				<LessonCard {lesson} />
			</div>
		{/each}
	</div>
{/if}

<!-- <div>
	<LessonCreation />
</div> -->

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.white);
	}
</style>
