<script lang="ts">
	import LessonCard from '$lib/lesson/LessonCard.svelte';
	import type { PageData } from './$houdini';

	export let data: PageData;
	$: ({ GetSubject } = data);
	$: subject = $GetSubject?.data?.getSubject;
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

{#if subject}
	<div class="m-4rounded-lg">
		<h1 class="text-2xl font-bold">{subject.name} {subject.currentLevel}</h1>

		{#each subject.lessons ?? [] as lesson}
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
