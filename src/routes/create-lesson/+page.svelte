<script lang="ts">
	import LessonOptions from '$lib/lessonCreation/LessonOptions.svelte';
	import Select from '$lib/inputs/Select.svelte';
	import Input from '$lib/inputs/Input.svelte';
	import { aiGenerate } from '$src/utils/generateCards';
	import {
		lessonGenerationSystemInstructions,
		requestLessonSuggestions
	} from '$src/utils/promptGenerators';

	export let data;
	$: ({ session, supabase } = data);
	$: userId = session?.user?.id;

	let level = '';
	let language = '';
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

	const { prompt, format } = requestLessonSuggestions({ level, language });
	const modelParams = { format: format };
	const messages = [
		{
			role: 'system',
			content: lessonGenerationSystemInstructions
		},
		{ role: 'user', content: prompt }
	];
</script>

<div class="flex flex-col m-4 gap-4">
	<form method="GET">
		<Select
			className="mb-3"
			label="Language"
			name="language"
			bind:value={language}
			placeholder="language"
		>
			<option value="German">German</option>
			<option value="English">English</option>
			<option value="French">French</option>
			<option value="Spanish">Spanish</option>
		</Select>

		<Input label="Level" name="level" bind:value={level} placeholder="Level" />
		{#if level && language}
			<button
				class="bg-blue-600 rounded-lg text-white p-2 mt-4"
				type="submit"
				on:click={async () => {
					isLoading = true;
					const response = await aiGenerate({
						modelParams,
						messages
					});
					aiResponse = response;
					isLoading = false;
				}}>{isLoading ? 'Loading...' : 'Generate Lessons'}</button
			>
		{/if}
	</form>

	{#if optionListObject && level && language}
		<LessonOptions
			options={optionListObject}
			subjectLanguage={language}
			userLanguage={'English'}
			currentLevel={level}
			subjectId={null}
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
