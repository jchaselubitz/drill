<script lang="ts">
	import type { PageData } from './$houdini';

	export let data: PageData;
	$: ({ GetSubject } = data);
	$: subject = $GetSubject.data.getSubject;
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

<div class="m-4 bg-gray-100 rounded-lg">
	<h1 class="text-2xl font-bold">{subject.name}</h1>
	<h2 class="text-xl font-bold">level: {subject.currentLevel}</h2>

	{#each subject.lessons as lesson}
		<div class="flex flex-col">
			<a href="/{subject.id}/{lesson.id}" class="text-xl font-bold">
				{lesson.name}
			</a>
			<p>{lesson.description}</p>
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
