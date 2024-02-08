<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { hashString } from '$src/utils/helpersDB';
	import { getAudioFile, playSavedAudio } from '$src/utils/helpersAudio';
	import AudioPlayButton from '$lib/buttons/AudioPlayButton.svelte';

	export let supabase: SupabaseClient<any, 'public', any>;
	export let bucket: string;
	export let audioObject = null as any;
	export let text: string | null;

	$: isLoading = false;
	$: isPlaying = false;

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
		const fileName = (await hashString(text as string)) + '.mp3'; // we take the hash of the text as the file name to make sure we don't generate audio for the same text twice.
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

		await getAudioFile({ text, fileName, supabase, bucket, setIsPlayingFalse, setIsLoadingFalse });
	}
</script>

<AudioPlayButton {isLoading} {isPlaying} handleClick={handlePlaySpeech} />
