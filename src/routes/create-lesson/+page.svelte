<script lang="ts">
	import LessonOptions from '$lib/lesson/LessonOptions.svelte';
	import LessonCreationForm from '$lib/lesson/LessonCreationForm.svelte';
	import { LanguagesISO639 } from '$src/utils/lists.js';

	export let data;
	$: ({ session, supabase, userLanguage } = data);
	$: userId = session?.user?.id;

	$: level = '';
	$: studyLanguage = '' as LanguagesISO639 | '';
	$: request = '';

	$: optionListObject = null;
	// $: optionListObject = JSON.parse(AITESTSTRING).concepts;
</script>

<div class="flex flex-col m-2 md:m-4 gap-4">
	<LessonCreationForm
		isAddition={false}
		{userLanguage}
		bind:studyLanguage
		bind:level
		bind:optionListObject
		bind:request
		{supabase}
	/>

	{#if optionListObject && level && studyLanguage !== ''}
		<LessonOptions
			options={optionListObject}
			{studyLanguage}
			{userLanguage}
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
