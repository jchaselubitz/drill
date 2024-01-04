<script lang="ts">
	import LinkButton from '$lib/buttons/LinkButton.svelte';
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
	{/if}
	<div class="flex justify-center">
		<LinkButton
			classes="flex max-w-max p-3 bg-blue-700 text-white rounded-md hover:bg-blue-800"
			href="./create-lesson">Create a lesson</LinkButton
		>
	</div>
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.white);
	}
</style>
