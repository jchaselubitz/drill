<script lang="ts">
	import cn from 'classnames';
	import Icon from 'svelte-awesome';
	import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons/faUpRightFromSquare';
	import type { Option } from './types';
	import { aiGenerate } from '$src/utils/generateCards';
	import {
		cardGenerationSystemInstructions,
		requestCardSuggestions
	} from '$src/utils/promptGenerators';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let selectedLessons: Option[] = [];
	export let option: Option;
	export let userLanguage: string;
	export let subjectLanguage: string;
	export let currentLevel: string;
	export let supabase: SupabaseClient<any, 'public', any>;
	export let userId: string | undefined;
	export let subjectId: string | null;
	let isLoading = false;
	let loadingImage = '/images/loading-circle.png';

	$: lessonLink = '';

	const { prompt, format } = requestCardSuggestions({
		concept: option.title,
		subject: subjectLanguage
	});

	const messages = [
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
			content: prompt
		}
	];

	const modelParams = {
		format
	};

	const handleSelected = async (option: Option) => {
		if (selectedLessons.includes(option)) {
			selectedLessons = selectedLessons.filter((lesson) => lesson !== option);
		} else {
			selectedLessons = [...selectedLessons, option];
		}
		isLoading = true;
		try {
			const response = await aiGenerate({
				modelParams,
				messages
			});
			const cardsArray = JSON.parse(response).cards;
			// const cardsArray = JSON.parse(`[{"side_1":"german", "side_2":"english"}]`).flat();
			if (cardsArray.length === 0) {
				return { result: 'No cards generated. Try again.' };
			}
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

	const handleKeyDown = (event: KeyboardEvent, option: Option) => {
		if (event.key === ' ') {
			handleSelected(option);
		}
	};
</script>

<div
	class={cn(
		'flex rounded-lg px-4 w-full h-20 items-center justify-start',
		' hover:bg-gray-200 hover:shadow-sm focus:bg-slate-300 transition-colors duration-200 ease-in-out',
		'bg-gray-100'
	)}
>
	<div class="grid grid-cols-12 gap-3 w-full">
		<button
			disabled={isLoading}
			type="submit"
			class="col-span-11 flex flex-col items-start"
			tabindex="0"
			on:click={() => handleSelected(option)}
			on:keydown={(e) => handleKeyDown(e, option)}
		>
			<div class="text-gray-700 text-sm font-bold mb-2">{option.title}</div>
			<div class="text-gray-700 text-sm text-left">{option.description}</div>
		</button>

		<div class="flex col-span-1 items-center">
			{#if isLoading}
				<img src={loadingImage} alt="loading" class="p-0 m-0 animate-spin" />
			{/if}
			{#if lessonLink}
				<a tabindex="0" href={lessonLink}> <Icon data={faUpRightFromSquare} /></a>
			{/if}
		</div>
	</div>
</div>
