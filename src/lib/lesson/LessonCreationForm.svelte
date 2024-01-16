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
	export let studyLanguage: string;
	export let userLanguage: string;
	export let level: string;
	export let request: string;
	export let optionListObject: any;

	$: isLoading = false;

	let languages = [
		{ name: 'German', value: 'German' },
		{ name: 'English', value: 'English' },
		{ name: 'French', value: 'French' },
		{ name: 'Spanish', value: 'Spanish' }
	];

	let levels = [
		{ name: 'A1', value: 'A1' },
		{ name: 'A2', value: 'A2' },
		{ name: 'B1', value: 'B1' },
		{ name: 'B2', value: 'B2' },
		{ name: 'C1', value: 'C1' },
		{ name: 'C2', value: 'C2' }
	];

	const handleGenerateCustomLesson = async () => {
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
</script>

<form method="GET">
	<Select className="mb-3" label="Language" name="language" bind:value={studyLanguage}>
		{#each languages as language}
			<option value={language.value}>{language.name}</option>
		{/each}
	</Select>

	<Select className="mb-3" label="Level" name="level" bind:value={level}>
		{#each levels as level}
			<option value={level.value}>{level.name}</option>
		{/each}
	</Select>

	{#if request === ''}
		<LoadingButton
			class="bg-blue-600 rounded-lg text-white p-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
			{isLoading}
			text="Generate Lesson Suggestions"
			loadingText="Generating..."
			onClick={handleGenerateLessonSuggestions}
			type="submit"
		/>

		<div class="flex gap-12 items-center my-4">
			<hr class="flex-1 border-gray-300" />
			OR
			<hr class="flex-1 border-gray-300" />
		</div>
	{/if}

	<Input
		label="Describe the material you would like to drill"
		name="request"
		isTextArea
		bind:value={request}
	/>

	{#if request !== ''}
		<LoadingButton
			class="bg-blue-600 rounded-lg text-white p-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
			{isLoading}
			text="Generate Custom Lesson"
			loadingText="Generating..."
			onClick={handleGenerateCustomLesson}
		/>
	{/if}
</form>
