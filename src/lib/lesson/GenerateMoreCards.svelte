<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { Card } from '$src/types/primaryTypes';
	import { getModelSelection, getOpenAiKey } from '$src/utils/helpersAI';
	import {
		cardGenerationSystemInstructions,
		cardResponseChecks,
		requestCardSuggestions
	} from '$src/utils/promptGenerators';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let userId: string | undefined;
	export let lessonId: number;
	export let lessonTitle: string;
	export let subjectLanguage: string;
	export let userLanguage: string;
	export let currentLevel: string;
	export let supabase: SupabaseClient<any, 'public', any>;
	let isLoading = false;

	async function handleGenerate() {
		isLoading = true;
		const { prompt, format } = requestCardSuggestions({
			concept: lessonTitle,
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
		try {
			const { data } = await supabase.functions.invoke('gen-text', {
				body: {
					userApiKey: getOpenAiKey(),
					modelSelection: getModelSelection(),
					modelParams: modelParams,
					messages: messages
				}
			});
			const cardsArray = cardResponseChecks(data);

			const cardsArrayWithLesson = cardsArray.map((card: Card) => {
				return { ...card, lesson_id: lessonId, user_id: userId };
			});
			const { error } = await supabase.from('cards').insert(cardsArrayWithLesson);
			if (error) {
				throw Error(`${'Failed to insert cards:'} ${error.message}`);
			}

			invalidate('app:lesson');
			isLoading = false;
		} catch (error) {
			isLoading = false;
			console.log('genText Error', error);
		}
	}
</script>

<button class="bg-blue-600 rounded-lg text-white p-2" type="submit" on:click={handleGenerate}
	>{isLoading ? 'Loading...' : 'Generate More Cards'}</button
>
