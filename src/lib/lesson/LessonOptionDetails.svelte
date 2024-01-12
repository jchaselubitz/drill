<script lang="ts">
	import Icon from 'svelte-awesome';
	import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons/faUpRightFromSquare';
	import type { Option } from './types';
	import { aiGenerate } from '$src/utils/generateCards';
	import {
		cardGenerationSystemInstructions,
		requestCardSuggestions
	} from '$src/utils/promptGenerators';
	import { invalidate } from '$app/navigation';
	import type { SupabaseClient } from '@supabase/supabase-js';

	let loadingImage = '/images/loading-circle.png';

	export let option: Option;

	export let userId: string | undefined;
	export let subjectId: string | null;
	export let subjectLanguage: string;
	export let currentLevel: string;
	export let supabase: SupabaseClient<any, 'public', any>;

	$: isLoading = false;
	$: cardsArray = option.cards ?? [];
	$: lessonLink = null;

	const fetchSuggestedCards = async () => {
		isLoading = true;
		const { prompt, format } = requestCardSuggestions({
			concept: option.title,
			subject: subjectLanguage,
			level: currentLevel
		});

		const messages = [
			{
				role: 'system',
				content: cardGenerationSystemInstructions({
					keyName: 'side_1',
					valueName: 'side_2'
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

		const response = await aiGenerate({
			modelParams,
			messages
		});

		cardsArray = JSON.parse(response).cards;
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
			console.log('aiGenerate Error', error);
		}
	};
</script>

<div>
	<div class="flex gap-2 w-full">
		{#if lessonLink}
			<a href={lessonLink}>
				<button class="bg-blue-600 rounded-lg text-white p-2 w-full">Go to deck</button>
			</a>
		{:else}
			<button
				class="bg-blue-600 rounded-lg text-white p-2 w-full"
				on:click={() => handleSave(option)}>Save Cards</button
			>
		{/if}
		<button class="bg-blue-600 rounded-lg text-white p-2 w-full" on:click={fetchSuggestedCards}
			>{isLoading ? 'Generating' : 'Generate Cards'}</button
		>
	</div>
	{#if cardsArray}
		{#each cardsArray as card}
			<div class="flex flex-col mt-2">
				<div class="flex">Side 1: {card.side_1}</div>
				<div class="flex">Side 2: {card.side_2}</div>
			</div>
		{/each}
	{/if}
</div>
