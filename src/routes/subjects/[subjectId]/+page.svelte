<script lang="ts">
	import LessonCard from '$lib/lesson/LessonCard.svelte';
	import { getModelSelection, getOpenAiKey } from '$src/utils/helpersAI.js';
	import LessonOptions from '$lib/lesson/LessonOptions.svelte';
	import {
		lessonGenerationSystemInstructions,
		requestLessonSuggestions
	} from '$src/utils/promptGenerators.js';
	import type { PageData } from './$types';
	import { LanguagesISO639, getLangValue } from '$src/utils/lists';
	import LessonCreationForm from '$lib/lesson/LessonCreationForm.svelte';

	export let data: PageData;
	$: ({ session, supabase, subject, lessons } = data);
	$: userId = session?.user?.id;
	const userLanguage = LanguagesISO639.English;
	$: studyLanguage = getLangValue(subject.name);
	$: subjectName = subject.name;
	$: request = '';

	let isLoading = false;

	$: aiResponse = null;
	$: optionListObject = aiResponse ? JSON.parse(aiResponse).concepts : null;
	// $: optionListObject = aiResponse ? JSON.parse(aiResponse) : null;

	$: level = subject.current_level;

	const handleGenerate = async () => {
		isLoading = true;
		const { prompt, format } = requestLessonSuggestions({ level, language: subjectName });

		const modelParams = { format };
		const messages = [
			{
				role: 'system',
				content: lessonGenerationSystemInstructions
			},
			{ role: 'user', content: prompt }
		];

		const { data } = await supabase.functions.invoke('gen-text', {
			body: {
				userApiKey: getOpenAiKey(),
				modelSelection: getModelSelection(),
				modelParams: modelParams,
				messages: messages
			}
		});
		aiResponse = data;
		isLoading = false;
	};
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

<div class="flex flex-col m-2 md:m-4 gap-4">
	{#if studyLanguage}
		<LessonCreationForm
			isAddition={true}
			{userLanguage}
			{studyLanguage}
			{level}
			bind:optionListObject
			bind:request
			{supabase}
		/>
	{/if}

	{#if optionListObject && level && studyLanguage}
		<LessonOptions
			options={optionListObject}
			{studyLanguage}
			{userLanguage}
			currentLevel={level}
			subjectId={subject.id}
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
