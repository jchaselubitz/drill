<script lang="ts">
	import SubjectCard from '$lib/components/subject/SubjectCard.svelte';
	import type { PageData } from './$houdini';

	export let data: PageData;

	$: ({ GetSubjects } = data);
	$: subjects = $GetSubjects.data?.querySubject;
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

<div class="m-4rounded-lg">
	<h1 class="text-2xl font-bold">My Subjects</h1>
	{#if subjects}
		<div class="flex flex-col gap-4">
			{#each subjects as subject, i}
				<SubjectCard {subject} />
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.white);
	}
</style>
