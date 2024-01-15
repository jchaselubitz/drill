<script lang="ts">
	import LessonOptions from '$lib/lesson/LessonOptions.svelte';
	import LessonCreationForm from '$lib/lesson/LessonCreationForm.svelte';
	import { json } from '@sveltejs/kit';

	export let data;
	$: ({ session, supabase } = data);
	$: userId = session?.user?.id;

	let userLanguage = 'English';
	$: level = '';
	$: studyLanguage = '';
	$: request = '';

	// const AITESTSTRING = `{"concepts":[
	//   {
	//     "title": "Noun Gender",
	//     "description": "Learn the gender (masculine, feminine, or neuter) of German nouns."
	//   },
	//   {
	//     "title": "Verb Conjugation",
	//     "description": "Practice conjugating regular and irregular verbs in different tenses."
	//   },
	//   {
	//     "title": "Cases (Nominative, Accusative, Dative, Genitive)",
	//     "description": "Understand how to use different cases for nouns, pronouns, and articles."
	//   },
	//   {
	//     "title": "Word Order",
	//     "description": "Master the correct word order in German sentences, including main and subordinate clauses."
	//   },
	//   {
	//     "title": "Modal Verbs",
	//     "description": "Learn how to use modal verbs like können, müssen, wollen, etc. in different contexts."
	//   },
	//   {
	//     "title": "Relative Clauses",
	//     "description": "Practice constructing and using relative clauses to provide additional information."
	//   },
	//   {
	//     "title": "Prepositions",
	//     "description": "Familiarize yourself with common prepositions and their usage in different contexts."
	//   }
	// ]}`;

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
