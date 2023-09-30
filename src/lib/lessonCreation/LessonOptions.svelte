<script lang="ts">
	import axios from 'axios';
	import cn from 'classnames';
	import {
		cardGenerationSystemInstructions,
		requestCardSuggestions
	} from '../../utils/promptGenerators';
	import { ADD_LESSON } from '../../utils/dgraphQueries/lesson';
	const OpenAiUrl = import.meta.env.VITE_OPENAI_CHAT_URL;
	const OpenAiKey = import.meta.env.VITE_OPENAI_API_KEY;

	const USERLANGUAGE = 'English';
	let subjectLanguage = 'German';

	export let subjectId: string;

	type Option = { title: string; description: string };
	export let options: Option[];
	let selectedLessons: Option[] = [];

	$: aiResponse = '';
	let optionListObject = [] as { key: string; value: string }[];
	$: lessonId = '';

	const saveLesson = async (title: string, description: string, subjectId: string) => {
		try {
			const response = await ADD_LESSON.mutate({ title, description, subjectId });
			lessonId = response.data.addLesson.lesson[0]?.id;
		} catch (error) {
			console.error(error);
		}
	};

	function setResponse(response: string) {
		aiResponse = response;
		optionListObject = aiResponse && JSON.parse(`[${aiResponse}]`).flat();
		console.log(optionListObject);
	}

	const handleGenerate = async () => {
		const payload = {
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content: cardGenerationSystemInstructions({
						concept: selectedLessons[0].title,
						keyName: USERLANGUAGE,
						valueName: subjectLanguage
					})
				},
				{
					role: 'user',
					content: requestCardSuggestions({
						concept: selectedLessons[0].title,
						subject: subjectLanguage
					})
				}
			],
			presence_penalty: 0,
			frequency_penalty: 0,
			temperature: 0.5,
			max_tokens: 3000
		};

		const response = await axios.post(OpenAiUrl, payload, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${OpenAiKey}`
			}
		});

		const assistantMessage = response.data.choices[0].message.content;
		setResponse(assistantMessage);
	};

	const handleSelected = (option: Option) => {
		saveLesson(option.title, option.description, subjectId);
		// handleGenerate();
		// if (selectedLessons.includes(option)) {
		// 	selectedLessons = selectedLessons.filter((lesson) => lesson !== option);
		// } else {
		// 	selectedLessons = [...selectedLessons, option];
		// }
	};

	const handleKeyDown = (event: KeyboardEvent, option: Option) => {
		if (event.key === ' ') {
			handleSelected(option);
		}
	};
</script>

<div class="flex flex-col m-4 gap-4 prose">
	{#each options as option}
		<div
			role="button"
			tabindex="0"
			class={cn(
				'flex flex-col rounded-lg  p-2',
				selectedLessons.includes(option) ? 'bg-slate-300' : 'bg-gray-100'
			)}
			on:click={() => handleSelected(option)}
			on:keydown={(e) => handleKeyDown(e, option)}
		>
			<div class="text-gray-700 text-sm font-bold mb-2">{option.title}</div>
			<div class="text-gray-700 text-sm mb-2">{option.description}</div>
		</div>
	{/each}

	<!-- <div class="flex flex-col gap-2">
		<div class="text-gray-700 text-sm font-bold mb-2">Selected Lessons</div>
		{#each selectedLessons as lesson}
			<div class="text-gray-700 text-sm mb-2">{lesson.title}</div>
		{/each}
	</div> -->

	<div class="flex flex-row justify-end">
		<button on:click={() => handleGenerate()} class="bg-blue-600 rounded-lg text-white p-2"
			>Create Decks</button
		>
	</div>
</div>

<!-- 
 tap to select
 selection is highlighted
 selection goes to DB

-->
