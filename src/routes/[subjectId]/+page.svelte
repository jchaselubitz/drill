<script lang="ts">
	import LessonCard from '$lib/lesson/LessonCard.svelte';
	import { genText } from '$src/utils/helpersAI.js';
	import LessonOptions from '$lib/lesson/LessonOptions.svelte';
	import {
		lessonGenerationSystemInstructions,
		requestLessonSuggestions
	} from '$src/utils/promptGenerators.js';

	export let data;
	$: ({ session, supabase, subject, lessons } = data);
	$: userId = session?.user?.id;

	let isLoading = false;

	// const AITESTSTRING = `{"concepts":[
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
	// ]}`;

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

<div class="flex flex-col m-4 gap-4">
	<div class="flex justify-center mt-4">
		<form method="GET">
			<button
				class="bg-blue-600 rounded-lg text-white p-2 mt-4"
				type="submit"
				on:click={handleGenerate}>{isLoading ? 'Loading...' : 'Generate Lessons'}</button
			>
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
