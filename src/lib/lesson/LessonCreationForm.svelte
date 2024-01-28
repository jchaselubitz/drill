<script lang="ts">
	import Select from '$lib/inputs/Select.svelte';
	import Input from '$lib/inputs/Input.svelte';
	import LoadingButton from '$lib/buttons/LoadingButton.svelte';
	import { genText } from '$src/utils/helpersAI';
	import {
		requestLessonSuggestions,
		lessonGenerationSystemInstructions,
		cardGenerationSystemInstructions,
		requestCardSuggestions,
		cardResponseChecks
	} from '$src/utils/promptGenerators';
	import { Languages, Levels, ContentSuggestions } from '$src/utils/lists';
	import LightSuggestionList from './LightSuggestionList.svelte';

	export let studyLanguage: string;
	export let userLanguage: string;
	export let level: string;
	export let request: string;
	export let optionListObject: any;

	$: isLoading = false;

	const handleGenerateCustomLesson = async () => {
		if (level === '' || studyLanguage === '') {
			alert('Please select a language and level');
			return;
		}
		isLoading = true;
		const { prompt, format } = requestCardSuggestions({
			userLanguage: userLanguage,
			studyLanguage: studyLanguage,
			level: level,
			concept: request
		});

		const modelParams = { format: format };
		const messages = [
			{
				role: 'system',
				content: cardGenerationSystemInstructions({ key1: 'side_1', key2: 'side_2' })
			},
			{ role: 'user', content: prompt }
		];

		const response = await genText({
			modelParams,
			messages
		});
		const cardsArray = cardResponseChecks(response);
		optionListObject = [{ title: request, description: level, cards: cardsArray }];
		isLoading = false;
	};

	const handleGenerateLessonSuggestions = async () => {
		if (level === '' || studyLanguage === '') {
			alert('Please select a language and level');
			return;
		}
		isLoading = true;
		const { prompt, format } = requestLessonSuggestions({ level, language: studyLanguage });

		const modelParams = { format: format };
		const messages = [
			{
				role: 'system',
				content: lessonGenerationSystemInstructions
			},
			{ role: 'user', content: prompt }
		];

		const response = await genText({
			modelParams,
			messages
		});
		optionListObject = JSON.parse(response).concepts;

		isLoading = false;
	};

	function setMaterialSuggestion(suggestion: string) {
		request = suggestion;
	}
</script>

<form method="GET">
	<Select className="mb-3" label="Language" name="language" bind:value={studyLanguage}>
		{#each Languages as language}
			<option value={language.value}>{language.name}</option>
		{/each}
	</Select>

	<Select className="mb-3" label="Level" name="level" bind:value={level}>
		{#each Levels as level}
			<option value={level.value}>{level.name}</option>
		{/each}
	</Select>

	<Input
		label="Describe the material you would like to drill"
		name="request"
		isTextArea
		placeholder="e.g. verb-adjective agreement, or business and political topics"
		bind:value={request}
	/>
	{#if request === ''}
		<LightSuggestionList
			suggestions={ContentSuggestions}
			{setMaterialSuggestion}
			{handleGenerateLessonSuggestions}
			includeSuggestionCreator
			{isLoading}
		/>
	{/if}

	{#if request !== ''}
		<LoadingButton
			class="bg-blue-600 rounded-lg text-white p-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
			{isLoading}
			text="Generate Lesson"
			loadingText="Generating..."
			onClick={handleGenerateCustomLesson}
		/>
	{/if}
</form>
