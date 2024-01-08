<script lang="ts">
	import LinkButton from '$lib/buttons/LinkButton.svelte';
	import LessonCard from '$lib/lesson/LessonCard.svelte';
	import { enhance } from '$app/forms';
	import { getModelSelection } from '$src/utils/generateCards';
	import { onMount } from 'svelte';
	import LessonOptions from '$lib/lessonCreation/LessonOptions.svelte';

	export let data;
	$: ({ subject, lessons } = data);

	$: openApiKey = '';
	$: modelSelection = '';

	onMount(() => {
		openApiKey = localStorage.getItem('OpenAIKey') ?? '';
		modelSelection = getModelSelection(localStorage);
	});

	let isLoading = false;

	const AITESTSTRING = `{"concepts":[
	  {
	    "title": "Noun Gender",
	    "description": "Learn the gender (masculine, feminine, or neuter) of German nouns."
	  },
	  {
	    "title": "Verb Conjugation",
	    "description": "Practice conjugating regular and irregular verbs in different tenses."
	  },
	  {
	    "title": "Cases (Nominative, Accusative, Dative, Genitive)",
	    "description": "Understand how to use different cases for nouns, pronouns, and articles."
	  },
	  {
	    "title": "Word Order",
	    "description": "Master the correct word order in German sentences, including main and subordinate clauses."
	  },
	  {
	    "title": "Modal Verbs",
	    "description": "Learn how to use modal verbs like können, müssen, wollen, etc. in different contexts."
	  },
	  {
	    "title": "Relative Clauses",
	    "description": "Practice constructing and using relative clauses to provide additional information."
	  },
	  {
	    "title": "Prepositions",
	    "description": "Familiarize yourself with common prepositions and their usage in different contexts."
	  }
	]}`;

	$: aiResponse = null;
	$: console.log('ai', aiResponse);
	$: optionListObject = aiResponse ? JSON.parse(aiResponse).concepts : null;
	// $: optionListObject = aiResponse ? JSON.parse(aiResponse) : null;
	$: console.log('optionListObject', optionListObject);
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

{#if subject}
	<div class="m-4rounded-lg">
		<h1 class="text-2xl font-bold">{subject.name} {subject.current_level}</h1>

		{#each lessons ?? [] as lesson}
			<div class="flex flex-col">
				<LessonCard {lesson} />
			</div>
		{/each}
	</div>
{/if}

<div class="flex flex-col m-4 gap-4">
	<div class="flex justify-center mt-4">
		<form
			method="POST"
			action="?/genLessons"
			use:enhance={() => {
				isLoading = true;
				return async ({ result, update }) => {
					isLoading = false;
					console.log('result', result);
					aiResponse = result.data.result;
				};
			}}
		>
			<input type="hidden" name="openApiKey" value={openApiKey} />
			<input type="hidden" name="modelSelection" value={modelSelection} />
			<input type="hidden" name="language" value={'English'} />
			<input type="hidden" name="currentLevel" value={subject.current_level} />
			<input type="hidden" name="subjectLanguage" value={subject.name} />

			<button class="bg-blue-600 rounded-lg text-white p-2 mt-4" type="submit"
				>{isLoading ? 'Loading...' : 'Generate Lessons'}</button
			>
		</form>
	</div>
	{#if optionListObject}
		<LessonOptions
			options={optionListObject}
			subjectLanguage={subject.name}
			userLanguage={'English'}
			currentLevel={subject.current_level}
		/>
	{/if}
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.white);
	}
</style>
