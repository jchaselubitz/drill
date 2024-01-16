<script lang="ts">
	import type { Option } from './types';
	import { genText } from '$src/utils/helpersAI';
	import LoadingButton from '$lib/buttons/LoadingButton.svelte';
	import {
		cardGenerationSystemInstructions,
		cardResponseChecks,
		requestCardSuggestions
	} from '$src/utils/promptGenerators';
	import { invalidate } from '$app/navigation';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let option: Option;

	export let userId: string | undefined;
	export let subjectId: string | null;
	export let subjectLanguage: string;
	export let userLanguage: string;
	export let currentLevel: string;
	export let supabase: SupabaseClient<any, 'public', any>;

	$: isLoading = false;
	$: cardsArray = option.cards ?? [];
	$: lessonLink = null as string | null;

	const fetchSuggestedCards = async () => {
		isLoading = true;
		const { prompt, format } = requestCardSuggestions({
			concept: option.title,
			studyLanguage: subjectLanguage,
			userLanguage: userLanguage,
			level: currentLevel
		});

		const messages = [
			{
				role: 'system',
				content: cardGenerationSystemInstructions({
					key1: 'side_1',
					key2: 'side_2'
				})
			},
			{
				role: 'user',
				content: prompt
			}
		];

		const modelParams = {
			format
		};

		const response = await genText({
			modelParams,
			messages
		});

		cardsArray = cardResponseChecks(response);
		isLoading = false;
	};

	const handleSave = async (option: Option) => {
		isLoading = true;
		try {
			const { data: dbData, error } = await supabase.rpc('create_subject_lesson_cards', {
				_subject_id: subjectId ?? null,
				_user_id: userId,
				_subject_name: subjectLanguage,
				_current_level: currentLevel,
				_lesson_title: option.title,
				_lesson_description: option.description,
				_cards: cardsArray
			});
			if (dbData) {
				lessonLink = `/${dbData.subject_id}/${dbData.lesson_id}`;
				invalidate('app:generated-lesson');
				isLoading = false;
			}
			if (error) {
				console.log('Error saving cards to db:', error);
			}
		} catch (error) {
			isLoading = false;
			console.log('genText Error', error);
		}
	};
</script>

<div class="p-1">
	<div class="flex px-4 pb-4 gap-2 w-full">
		{#if lessonLink}
			<a class="bg-blue-600 rounded-lg p-2 w-full" href={lessonLink}>
				<button class=" text-white text-center w-full">Go to deck</button>
			</a>
		{:else}
			<button
				class="bg-blue-600 rounded-lg text-white p-2 w-full"
				on:click={() => handleSave(option)}>Save Cards</button
			>
		{/if}
		<LoadingButton
			class="bg-blue-600 rounded-lg text-white p-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
			disabled={isLoading}
			{isLoading}
			text={cardsArray.length > 0 ? 'Regenerate Cards' : 'Generate Cards'}
			loadingText="Generating..."
			onClick={fetchSuggestedCards}
		/>
	</div>

	{#if cardsArray}
		{#each cardsArray as card}
			<div class="flex flex-col odd:bg-white even:bg-gray-100 p-2">
				<span class="flex leading-tight">
					<span class="font-bold whitespace-nowrap mr-1">Side 1:</span>
					<span>{card.side_1}</span>
				</span>
				<span class="flex leading-tight">
					<span class="font-bold whitespace-nowrap mr-1">Side 2:</span>
					<span>{card.side_2}</span>
				</span>
			</div>
		{/each}
	{/if}
</div>
