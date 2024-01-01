<script lang="ts">
	import LessonOptions from '$lib/lessonCreation/LessonOptions.svelte';
	import axios from 'axios';
	import { enhance } from '$app/forms';

	// import LessonSuggestions from '$lib/lessonCreation/LessonSuggestions.svelte';
	import SubjectLevelSelector from '$lib/lessonCreation/SubjectLevelSelector.svelte';
	import {
		lessonGenerationSystemInstructions,
		requestLessonSuggestions
	} from '$src/utils/promptGenerators';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let generation: ActionData;
	$: ({ supabase, session } = data);
	$: user = session?.user;

	let level = '';
	let language = '';
	let isLoading = false;

	// const AITESTSTRING = `[
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
	// ]`;

	$: aiResponse = null;
	$: optionListObject = aiResponse ? JSON.parse(`[${aiResponse}]`).flat() : null;
	$: console.log({ generation, aiResponse, optionListObject, isLoading });
	// $: optionListObject = JSON.parse(`[${AITESTSTRING}]`).flat();
	// let optionListObject = [] as { title: string; description: string }[];

	const createSubjectLessonCards = async (
		lessonTitle: string,
		lessonDescription: string,
		cards: any
	) => {
		const { data, error } = await supabase.rpc('create_subject_lesson_cards', {
			_user_id: user?.id,
			_subject_name: language,
			_current_level: level,
			_lesson_title: lessonTitle,
			_lesson_description: lessonDescription,
			_cards: cards
		});
		if (error) {
			console.error('Error:', error);
			return false;
		}
		return true;
	};
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

<div class="m-4 bg-gray-100 rounded-lg">
	<p>{user?.id}</p>
	<h1 class="text-2xl font-bold">My Subjects</h1>
	<!-- {#if subjects}
		{#each subjects as subject, i}
			<div>
				{subject.id}
				{subject.name}
				{subject.current_level}
			</div>
		{/each}
	{/if} -->
</div>

<div class="flex flex-col m-4 gap-4">
	<SubjectLevelSelector bind:language bind:level />

	{#if level && language}
		<form
			method="POST"
			action="?/genLessons"
			use:enhance={() => {
				isLoading = true;
				return async ({ result, update }) => {
					isLoading = false;
					aiResponse = result.data.result;
				};
			}}
		>
			<button class="bg-blue-600 rounded-lg text-white p-2" type="submit"
				>{isLoading ? 'Loading...' : 'Generate'}</button
			>
		</form>

		{#if optionListObject}
			<LessonOptions options={optionListObject} {createSubjectLessonCards} />
		{/if}
	{/if}
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.white);
	}
</style>
