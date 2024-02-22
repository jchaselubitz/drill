<script lang="ts">
	import { invalidate } from '$app/navigation';
	import ImportPodcast from '$lib/assimilation/ImportPodcast.svelte';
	import RecordButton from '$lib/buttons/RecordButton.svelte';
	import UploadButton from '$lib/buttons/UploadButton.svelte';
	import type { RecordButtonStateType } from '$lib/buttons/types';
	import { getOpenAiKey } from '$src/utils/helpersAI';
	import { recordAudio, savePrivateAudioFile } from '$src/utils/helpersAudio';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import MediaReview from './MediaReview.svelte';

	export let supabase: SupabaseClient;
	export let userId: string | undefined;
	export let transcript = '';

	let recordingButtonState = 'idle' as RecordButtonStateType;

	$: transcriptionLoading = false;
	$: recordingState = null as any;
	$: audioResponse = null as any;
	$: audioState = null as any;
	$: isSaving = false;
	$: isPlaying = false;
	$: importingPodcast = false;

	const resetRecordingButtonState = () => {
		recordingButtonState = 'idle';
		transcriptionLoading = false;
		recordingState = null;
		audioResponse = null;
		audioState = null;
		transcript = '';
		isSaving = false;
		isPlaying = false;
		importingPodcast = false;
	};

	const startRecording = async () => {
		audioResponse = null;
		const recording = await recordAudio();
		if (recordingButtonState === 'idle') {
			recordingButtonState = 'recording';
			recording.start();
		}
		recordingState = recording;
	};

	const stopRecording = async () => {
		const response = await recordingState.stop();
		recordingButtonState = 'idle';
		audioResponse = response;
	};

	const handleUpload = async (file: File) => {
		transcript = '';
		recordingButtonState = 'disabled';
		const audioBlob = new Blob([file], { type: 'audio/mp4' });
		const url = URL.createObjectURL(audioBlob);
		audioResponse = { blob: audioBlob, url: url };
	};

	const importPodcast = async (url: string) => {
		transcript = '';
		importingPodcast = true;
		audioResponse = null;
		try {
			recordingButtonState = 'disabled';
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const arrayBuffer = await response.arrayBuffer();
			const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
			const audioURL = URL.createObjectURL(audioBlob);
			audioResponse = { blob: audioBlob, url: audioURL };
		} catch (error) {
			console.error('Error fetching podcast:', error);
			// Handle the error, e.g., show a notification to the user
		} finally {
			recordingButtonState = 'idle';
			importingPodcast = false;
		}
	};

	// const playPauseRecording = () => {
	// 	if (isPlaying) {
	// 		audioState.pause();
	// 		isPlaying = false;
	// 	} else {
	// 		if (!audioState) {
	// 			audioState = new Audio(audioResponse.url);
	// 		}
	// 		isPlaying = true;
	// 		audioState.play().catch((e) => {
	// 			throw Error('Error playing audio:', e);
	// 		});
	// 		audioState.onended = () => {
	// 			isPlaying = false;
	// 		};
	// 	}
	// };

	const transcribeRecording = async () => {
		recordingButtonState = 'transcribing';
		transcriptionLoading = true;
		const formData = new FormData();
		formData.append('userApiKey', getOpenAiKey() as string);
		formData.append('audioFile', audioResponse.blob, 'recording.mp4');
		const { data: transcription } = await supabase.functions.invoke('speech-to-text', {
			body: formData
		});
		transcriptionLoading = false;
		recordingButtonState = 'disabled';
		transcript = transcription.data;
	};
	const saveRecording = async () => {
		isSaving = true;
		const fileName = `${Date.now()}-recording`;
		const bucketName = 'user_recordings';
		await savePrivateAudioFile({
			fileName,
			path: userId as string,
			supabase: supabase,
			bucketName,
			audioFile: audioResponse.blob
		});
		//save transcript	to database
		const { data, error: langError } = await supabase.functions.invoke('check-language', {
			body: {
				text: transcript
			}
		});
		if (langError) {
			throw Error(`Error checking language: ${langError}`);
		}
		const lang = JSON.parse(data).lng;
		const { error } = await supabase.from('recordings').insert({
			user_id: userId,
			transcript: transcript,
			filename: fileName,
			lang
		});
		resetRecordingButtonState();
		if (error) {
			throw Error(`Error saving recording: ${error}`);
		}
		resetRecordingButtonState();
		invalidate('app:my-media');
	};

	const handleClick = () => {
		if (recordingButtonState === 'disabled') {
			return;
		}
		if (recordingButtonState === 'recording') {
			stopRecording();
		} else {
			startRecording();
		}
	};
</script>

<div class="flex flex-col md:flex-row justify-center items-center mt-6 mb-10 gap-3">
	<div class="flex justify-center items-center gap-3 mb-2">
		<ImportPodcast {importPodcast} />
		<UploadButton {handleUpload} />
		<RecordButton {recordingButtonState} {handleClick} />
	</div>

	<!-- {#if showActionButtons && liveActionButtons.length > 0}
		<div class="flex flex-col gap-2">
			{#each liveActionButtons as button}
				<button
					class="px-3 py-1 border border-blue-600 text-blue-600 rounded-full text-sm"
					on:click={button.onClick}
				>
					{button.isLoading ? 'Loading...' : button.text}
				</button>
			{/each}
		</div>
	{/if} -->

	{#if importingPodcast}
		<p>Importing podcast...</p>
	{:else if audioResponse}
		<MediaReview
			bind:audioResponse
			{transcriptionLoading}
			{transcribeRecording}
			{saveRecording}
			{resetRecordingButtonState}
			isTranscript={transcript !== ''}
		/>
	{/if}
</div>
