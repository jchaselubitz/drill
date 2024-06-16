<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { getModelSelection, getOpenAiKey } from '$src/utils/helpersAI';
	import type { LanguagesISO639 } from '$src/utils/lists';
	import {
		cardGenerationSystemInstructions,
		cardResponseChecks,
		requestCardSuggestions
	} from '$src/utils/promptGenerators';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let userId: string | undefined;
	export let lessonId: number;
	export let lessonTitle: string;
	export let studyLanguage: LanguagesISO639;
	export let userLanguage: LanguagesISO639;
	export let currentLevel: string | null;
	export let supabase: SupabaseClient<any, 'public', any>;
	let isLoading = false;

	async function handleGenerate() {
		isLoading = true;
		const { prompt, format } = requestCardSuggestions({
			concept: lessonTitle,
			studyLanguage: studyLanguage,
			userLanguage: userLanguage,
			level: currentLevel ?? ''
		});

		const messages = [
			{
				role: 'system',
				content: cardGenerationSystemInstructions({
					lang1: userLanguage,
					lang2: studyLanguage
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

			const cardsArray = cardResponseChecks({
				response: data,
				lang1: userLanguage,
				lang2: studyLanguage
			});

			const { error } = await supabase.rpc('add_translations_to_lesson', {
				_lesson_id: lessonId,
				_translations: cardsArray,
				_user_id: userId
			});

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
