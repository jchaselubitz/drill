<script lang="ts">
	import type { PageData } from './$houdini';
	import LessonCreation from '$lib/lessonCreation/index.svelte';

	export let data: PageData;

	$: ({ LessonGetSubjects } = data);
	$: subjects = $LessonGetSubjects.data?.querySubject;
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

<div class="m-4 bg-gray-100 rounded-lg">
	<h1 class="text-2xl font-bold">My Subjects</h1>
	{#if subjects}
		{#each subjects as subject, i}
			<div>
				{subject.id}
				{subject.name}
				{subject.currentLevel}
			</div>
		{/each}
	{/if}
</div>

<div>
	<LessonCreation />
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.white);
	}
</style>
