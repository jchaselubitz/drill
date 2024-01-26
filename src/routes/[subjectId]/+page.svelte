<script lang="ts">
	import LessonCard from '$lib/lesson/LessonCard.svelte';
	import { genText } from '$src/utils/helpersAI.js';
	import LessonOptions from '$lib/lesson/LessonOptions.svelte';
	import {
		lessonGenerationSystemInstructions,
		requestLessonSuggestions
	} from '$src/utils/promptGenerators.js';
	import LoadingButton from '$lib/buttons/LoadingButton.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ session, supabase, subject, lessons } = data);
	$: userId = session?.user?.id;

	let isLoading = false;

	$: aiResponse = null;
	$: optionListObject = aiResponse ? JSON.parse(aiResponse).concepts : null;
	// $: optionListObject = aiResponse ? JSON.parse(aiResponse) : null;

	$: language = subject.name;
	$: level = subject.current_level;

	const handleGenerate = async () => {
		isLoading = true;
		const { prompt, format } = requestLessonSuggestions({ level, language });

		const modelParams = { format };
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
		aiResponse = response;
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

<div class="flex flex-col gap-4">
	<div class="flex justify-center mt-4">
		<form method="GET">
			<LoadingButton
				class="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
				{isLoading}
				text="Generate Lesson Suggestions"
				loadingText="Generating..."
				onClick={handleGenerate}
			/>
		</form>
	</div>
	{#if optionListObject}
		<LessonOptions
			{userId}
			{supabase}
			subjectId={subject.id}
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
