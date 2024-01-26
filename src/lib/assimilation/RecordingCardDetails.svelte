<script lang="ts">
	import { invalidate } from '$app/navigation';
	import AudioPlayButton from '$lib/buttons/AudioPlayButton.svelte';
	import DeleteButton from '$lib/buttons/DeleteButton.svelte';
	import type { Recording } from '$src/types/primaryTypes';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let supabase: SupabaseClient;
	export let recording: Recording;
	export let playLoading = false;
	export let playRecording: () => Promise<void>;
	let deleteLoading = false;

	async function deleteRecording() {
		const { error } = await supabase.from('recordings').delete().match({ id: recording.id });
		if (error) {
			throw Error('Error deleting recording:', error);
		}
		invalidate('app:my-content');
	}
</script>

<div class="flex flex-col gap-2 mt-4">
	<div class="flex justify-center gap-2">
		<DeleteButton handleClick={deleteRecording} isLoading={deleteLoading} />
		<AudioPlayButton handleClick={playRecording} isLoading={playLoading} />
	</div>
</div>
