<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { aiGenerate } from '$src/utils/generateCards';
	import {
		cardGenerationSystemInstructions,
		requestCardSuggestions
	} from '$src/utils/promptGenerators';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let userId: string | undefined;
	export let lessonId: number;
	export let lessonTitle: string;
	export let subjectLanguage: string;
	export let currentLevel: string;
	export let supabase: SupabaseClient<any, 'public', any>;
	let isLoading = false;

	async function handleGenerate() {
		isLoading = true;
		const { prompt, format } = requestCardSuggestions({
			concept: lessonTitle,
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
		try {
			const response = await aiGenerate({
				modelParams,
				messages
			});
			const cardsArray = JSON.parse(response).cards;
			if (cardsArray.length === 0) {
				return { result: 'No cards generated. Try again.' };
			}
			const cardsArrayWithLesson = cardsArray.map((card) => {
				return { ...card, lesson_id: lessonId, user_id: userId };
			});
			const { error } = await supabase.from('cards').insert(cardsArrayWithLesson);
			if (error) {
				throw Error(`${'Failed to insert cards:'} ${error.message}`);
			}

			invalidate('app:cardUpdate');
			isLoading = false;
		} catch (error) {
			isLoading = false;
			console.log('aiGenerate Error', error);
		}
	}
</script>

<button class="bg-blue-600 rounded-lg text-white p-2 mt-4" type="submit" on:click={handleGenerate}
	>{isLoading ? 'Loading...' : 'Generate More Cards'}</button
>
