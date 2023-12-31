<script lang="ts">
	import LessonOptions from '$lib/lessonCreation/LessonOptions.svelte';

	// import LessonSuggestions from '$lib/lessonCreation/LessonSuggestions.svelte';
	import SubjectLevelSelector from '$lib/lessonCreation/SubjectLevelSelector.svelte';
	import { requestLessonSuggestions } from '$src/utils/promptGenerators';
	import type { PageData } from './$types';

	const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
	const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

	export let data: PageData;
	$: ({ supabase, session } = data);
	$: user = session?.user;

	let level = '';
	let language = '';

	const AITESTSTRING = `[
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
	]`;

	$: prompt = requestLessonSuggestions({ level, language });
	$: aiResponse = '';
	let optionListObject = JSON.parse(`[${AITESTSTRING}]`).flat();
	// let optionListObject = [] as { title: string; description: string }[];

	function setResponse(response: string) {
		aiResponse = response;
		optionListObject = aiResponse && JSON.parse(`[${aiResponse}]`).flat();
	}

	const handleGenerate = async () => {
		// try {
		// 	const response = await axios.post(
		// 		OPENAI_URL,
		// 		{
		// 			model: 'gpt-3.5-turbo',
		// 			messages: [
		// 				{
		// 					role: 'system',
		// 					content: lessonGenerationSystemInstructions
		// 				},
		// 				{ role: 'user', content: prompt }
		// 			],
		// 			presence_penalty: 0,
		// 			frequency_penalty: 0,
		// 			temperature: 0.5,
		// 			max_tokens: 1000
		// 		},
		// 		{
		// 			headers: {
		// 				'Content-Type': 'application/json',
		// 				Authorization: `Bearer ${OPENAI_KEY}`
		// 			}
		// 		}
		// 	);
		// 	const assistantMessage = response.data.choices[0].message.content;
		// 	console.log(assistantMessage);
		// 	setResponse(assistantMessage);
		// 	return {
		// 		status: 200,
		// 		body: {
		// 			message: assistantMessage
		// 		}
		// 	};
		// } catch (error) {
		// 	console.error('OpenAI API Error:', error.response?.data, error.response?.message);
		// 	return {
		// 		status: 500,
		// 		body: {
		// 			message: 'I am having trouble connecting to my server. Try sending me another message.'
		// 		}
		// 	};
		// }
	};

	const createSubjectLessonCards = async (lessonTitle: string, cards: any) => {
		const { data, error } = await supabase.rpc('create_subject_lesson_cards', {
			_user_id: user?.id,
			_subject_name: language,
			_current_level: level,
			_lesson_title: lessonTitle,
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
		<button class="bg-blue-600 rounded-lg text-white p-2" on:click={handleGenerate}>Generate</button
		>
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
