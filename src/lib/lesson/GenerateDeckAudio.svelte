<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { Translation } from '$src/types/primaryTypes';
	import { getAudioFile } from '$src/utils/helpersAudio';
	import { hashString } from '$src/utils/helpersDB';

	import type { SupabaseClient } from '@supabase/supabase-js';

	export let supabase: SupabaseClient<any, 'public', any>;
	export let translations: (Translation | undefined)[];
	export let bucket: string;
	export let updateAudioStatuses: () => {};

	let isLoading = false;

	async function handleGenerate() {
		isLoading = true;

		const genAudioFiles = () =>
			translations.map(async (translation, i) => {
				if (!translation) return;
				const { phrase_secondary_id } = translation;
				await getAudioFile({
					text: phrase_secondary_id.text as string,
					fileName: (await hashString(phrase_secondary_id.text as string)) + '.mp3',
					supabase,
					bucket,
					setIsLoadingFalse: () => {
						if (i === translations.length - 1) {
							isLoading = false;
							updateAudioStatuses();
							invalidate('app:lesson');
						}
					}
				});
			});
		await Promise.all(genAudioFiles());
	}
</script>

<button
	class="w-full border-2 border-blue-600 rounded-lg text-blue-600 font-medium p-2"
	type="submit"
	on:click={handleGenerate}>{isLoading ? 'Generating...' : 'Generate Audio'}</button
>
