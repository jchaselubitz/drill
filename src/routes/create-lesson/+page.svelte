<script lang="ts">
	import LessonOptions from '$lib/lesson/LessonOptions.svelte';
	import LessonCreationForm from '$lib/lesson/LessonCreationForm.svelte';

	export let data;
	$: ({ session, supabase } = data);
	$: userId = session?.user?.id;

	let userLanguage = 'English';
	$: level = '';
	$: studyLanguage = '';
	$: request = '';

	$: optionListObject = null;
	// $: optionListObject = JSON.parse(AITESTSTRING).concepts;
</script>

<div class="flex flex-col m-2 md:m-4 gap-4">
	<LessonCreationForm
		{userLanguage}
		bind:studyLanguage
		bind:level
		bind:optionListObject
		bind:request
		{supabase}
	/>

	{#if optionListObject && level && studyLanguage}
		<LessonOptions
			options={optionListObject}
			subjectLanguage={studyLanguage}
			userLanguage={'English'}
			currentLevel={level}
			subjectId={null}
			{supabase}
			{userId}
		/>
	{/if}
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.white);
	}
</style>
