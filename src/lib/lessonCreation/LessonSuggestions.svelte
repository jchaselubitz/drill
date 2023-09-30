<script lang="ts">
	import axios from 'axios';
	import { ADD_SUBJECT } from '../../utils/dgraphQueries/subject';

	import {
		lessonGenerationSystemInstructions,
		requestLessonSuggestions
	} from '../../utils/promptGenerators';

	import LessonOptions from './LessonOptions.svelte';
	import { graphql } from '$houdini';

	const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
	const OPENAI_KEY = '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';
	export let level: string;
	export let language: string;

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
	$: subjectId = '';

	function setResponse(response: string) {
		aiResponse = response;
		optionListObject = aiResponse && JSON.parse(`[${aiResponse}]`).flat();
	}

	const saveSubjectAndLevel = async () => {
		try {
			const response = await ADD_SUBJECT.mutate({ name: language, currentLevel: level });
			subjectId = response.data.addSubject.subject[0]?.id;
		} catch (error) {
			console.error(error);
		}
	};

	// const handleGenerate = async () => {
	// 	console.log(prompt);

	// 	const payload = {
	// 		messages: [{ role: 'user', content: prompt }],
	// 		temperature: 0.5,
	// 		maxTokens: 1000,
	// 		apiKey: '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'
	// 	};

	// 	const response = await fetch('/chatbot', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(payload)
	// 	});

	// 	// handle the response from the API call
	// 	if (response.ok) {
	// 		const data = await response.json();
	// 		const output: string = data.message;
	// 		console.log(output);
	// 	} else {
	// 		console.log('error', response.status + ' ' + response.statusText);
	// 	}
	// };

	const handleGenerate = async () => {
		saveSubjectAndLevel();
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
</script>

<button class="bg-blue-600 rounded-lg text-white p-2" on:click={handleGenerate}>Generate</button>
{#if optionListObject && subjectId !== ''}
	<LessonOptions options={optionListObject} {subjectId} />
{/if}
