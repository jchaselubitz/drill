<script lang="ts">
	import SubjectCard from '$lib/subject/SubjectCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ subjects } = data);
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

<div class="m-4rounded-lg">
	<h1 class="text-2xl font-bold">My Subjects</h1>
	{#if subjects.length > 0}
		<div class="flex flex-col gap-4">
			{#each subjects as subject, i}
				<SubjectCard {subject} />
			{/each}
		</div>
	{:else}
		<div class=""><a href="./create-lesson">Create a lesson</a></div>
	{/if}
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.white);
	}
</style>
