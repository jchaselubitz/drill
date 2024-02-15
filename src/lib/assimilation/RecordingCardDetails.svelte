<script lang="ts">
	import { invalidate } from '$app/navigation';
	import AudioPlayButton from '$lib/buttons/AudioPlayButton.svelte';
	import DeleteButton from '$lib/buttons/DeleteButton.svelte';
	import type { Recording } from '$src/types/primaryTypes';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import ContentRequest from './ContentRequest.svelte';

	export let supabase: SupabaseClient;
	export let userId: string | undefined;
	export let recording: Recording;
	export let isPlaying = false;
	export let handlePlayClick: () => void;
	let deleteLoading = false;

	async function deleteRecording() {
		const { error } = await supabase.from('recordings').delete().match({ id: recording.id });
		if (error) {
			throw Error(`Error deleting recording: ${error}`);
		}
		invalidate('app:my-media');
	}
</script>

<div class="flex flex-col gap-2 mt-4">
	<div class="flex justify-center gap-2">
		<DeleteButton handleClick={deleteRecording} isLoading={deleteLoading} />
		<AudioPlayButton handleClick={handlePlayClick} {isPlaying} />
	</div>
	<!-- <button class="px-3 py-1 border border-blue-600 text-blue-600 rounded-full text-sm">
  Translate
 </button>
 <button class="px-3 py-1 border border-blue-600 text-blue-600 rounded-full text-sm">
  list sentences
 </button>
 <button class="px-3 py-1 border border-blue-600 text-blue-600 rounded-full text-sm">
  list verbs
 </button> -->

	<ContentRequest
		text={recording.transcript}
		lang={recording.lang}
		{userId}
		{supabase}
		source="transcript"
	/>
</div>
