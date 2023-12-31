<script lang="ts">
	import axios from 'axios';
	import cn from 'classnames';
	import {
		cardGenerationSystemInstructions,
		requestCardSuggestions
	} from '../../utils/promptGenerators';

	const OpenAiUrl = import.meta.env.VITE_OPENAI_CHAT_URL;
	const OpenAiKey = import.meta.env.VITE_OPENAI_API_KEY;

	const USERLANGUAGE = 'English';
	let subjectLanguage = 'German';

	export let createSubjectLessonCards: (
		lessonTitle: string,
		lessonDescription: string,
		cards: Card[]
	) => void;

	type Option = { title: string; description: string };
	type Card = { side1: string; side2: string; lesson: string };
	export let options: Option[];
	let selectedLessons: Option[] = [];

	let cardObjects = [] as Card[];

	function setResponse(response: string) {
		cardObjects = response && JSON.parse(`[${response}]`).flat();
		return cardObjects;
	}

	const handleGenerate = async (option) => {
		const payload = {
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content: cardGenerationSystemInstructions({
						concept: option.title,
						keyName: 'side_1',
						valueName: 'side_2'
					})
				},
				{
					role: 'user',
					content: requestCardSuggestions({
						concept: option.title,
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
		const objects = setResponse(assistantMessage);

		createSubjectLessonCards(option.title, option.description, objects);
	};

	const handleSelected = (option: Option) => {
		if (selectedLessons.includes(option)) {
			selectedLessons = selectedLessons.filter((lesson) => lesson !== option);
		} else {
			selectedLessons = [...selectedLessons, option];
		}

		handleGenerate(option);
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
</div>

<!-- 
 tap to select
 selection is highlighted
 selection goes to DB

-->
