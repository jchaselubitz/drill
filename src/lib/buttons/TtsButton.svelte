<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { hashString } from '$src/utils/helpersDB';
	import { getAudioFile, playSavedAudio } from '$src/utils/helpersAudio';
	import AudioPlayButton from '$lib/buttons/AudioPlayButton.svelte';

	export let supabase: SupabaseClient<any, 'public', any>;
	export let bucket: string;
	export let lacksAudio: boolean;
	export let audioObject = null as any;
	export let text: string | null;

	$: isLoading = false;
	$: isPlaying = false;
	$: exists = !lacksAudio;

	async function handlePlaySpeech() {
		if (!text) return;
		if (isPlaying) {
			audioObject.pause();
			isPlaying = false;
			return;
		}
		function setIsPlayingFalse() {
			isPlaying = false;
		}
		function setIsLoadingFalse() {
			isLoading = false;
		}
		const fileName = (await hashString(text as string)) + '.mp3';
		const playedExistingFile = await playSavedAudio({
			fileName,
			supabase,
			bucket,
			setIsPlayingFalse
		});
		if (playedExistingFile) {
			isPlaying = true;
			audioObject = playedExistingFile;
			return;
		}
		isLoading = true;
		isPlaying = true;
		exists = true;

		await getAudioFile({
			text,
			fileName,
			supabase,
			bucket,
			playAfterSave: true,
			setIsPlayingFalse,
			setIsLoadingFalse
		});
	}
</script>

<AudioPlayButton {exists} {isLoading} {isPlaying} handleClick={handlePlaySpeech} />
