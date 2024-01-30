<script lang="ts">
	import { invalidate } from '$app/navigation';
	import RecordButton from '$lib/buttons/RecordButton.svelte';
	import type { RecordButtonStateType } from '$lib/buttons/types';
	import { getOpenAiKey } from '$src/utils/helpersAI';
	import { recordAudio, savePrivateAudioFile } from '$src/utils/helpersAudio';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let supabase: SupabaseClient;
	export let userId: string | undefined;
	export let transcript = '';

	let recordingButtonState = 'idle' as RecordButtonStateType;
	let showActionButtons = false;
	$: transcriptionLoading = false;
	$: audioState = null as any;
	$: audioResponse = null as any;
	$: isSaving = false;

	const resetRecordingButtonState = () => {
		recordingButtonState = 'idle';
		showActionButtons = false;
		transcriptionLoading = false;
		audioState = null;
		transcript = '';
		isSaving = false;
	};

	const startRecording = async () => {
		const audio = await recordAudio();
		if (recordingButtonState === 'idle') {
			recordingButtonState = 'recording';
			showActionButtons = false;
			audio.start();
		}
		audioState = audio;
	};

	const stopRecording = async () => {
		const response = await audioState.stop();
		audioResponse = response;
		recordingButtonState = 'idle';
		showActionButtons = true;
		// show refresh option
		// show transcribe option
	};

	const playRecording = () => {
		const audio = new Audio(audioResponse.url);
		audio.play().catch((e) => {
			throw Error('Error playing audio:', e);
		});
	};

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

	// const setIsloadingFalse = () => {
	// 	transcriptionLoading = false;
	// };

	// const transcribeRecording = async () => {
	// 	recordingButtonState = 'transcribing';
	// 	transcriptionLoading = true;

	// 	const transcription = await getTextFromSpeech({
	// 		audioFile: audioResponse.blob,
	// 		setIsloadingFalse
	// 	});
	// 	transcript = transcription.data;
	// 	recordingButtonState = 'disabled';
	// 	transcriptionLoading = false;
	// };

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

		if (error) {
			throw Error(`Error saving recording: ${error}`);
		}
		resetRecordingButtonState();
		invalidate('app:my-content');
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

	$: actionButtons = [
		{
			show: true,
			isLoading: false,
			text: 'Play',
			onClick: () => {
				playRecording();
			}
		},
		{
			show: true,
			isLoading: false,
			text: 'Reset',
			onClick: () => {
				resetRecordingButtonState();
			}
		},
		{
			show: true,
			isLoading: false,
			text: 'Transcribe',
			onClick: () => {
				transcribeRecording();
			}
		},
		{
			show: transcript !== '',
			isLoading: isSaving,
			text: 'Save Recording',
			onClick: () => {
				saveRecording();
			}
		}
	];
</script>

<div class="flex justify-center mt-6 mb-10">
	<RecordButton {recordingButtonState} {actionButtons} {showActionButtons} {handleClick} />
</div>
