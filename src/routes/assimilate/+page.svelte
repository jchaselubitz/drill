<script lang="ts">
	import RecordButton from '$lib/buttons/RecordButton.svelte';
	import type { RecordButtonStateType } from '$lib/buttons/types';
	import { getTextFromSpeech, recordAudio, savePrivateAudioFile } from '$src/utils/helpersAudio';

	let recordingButtonState = 'idle' as RecordButtonStateType;
	let showActionButtons = false;

	import type { PageData } from './$types';
	export let data: PageData;
	$: ({ supabase, session } = data);
	$: userId = session?.user.id;

	$: transcriptionLoading = false;
	$: transcript = '';
	$: audioState = null as any;
	$: audioResponse = null as any;

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

	const setIsloadingFalse = () => {
		transcriptionLoading = false;
	};

	const transcribeRecording = async () => {
		recordingButtonState = 'transcribing';
		transcriptionLoading = true;

		const transcription = await getTextFromSpeech({
			audioFile: audioResponse.blob,
			setIsloadingFalse
		});
		transcript = transcription.data;
		recordingButtonState = 'recording';
		transcriptionLoading = false;
	};

	const saveRecording = async () => {
		const fileName = `${Date.now()}-recording`;
		await savePrivateAudioFile({
			fileName,
			path: userId as string,
			supabase: supabase,
			bucketName: 'user_recordings',
			audioFile: audioResponse.blob
		});
	};

	const handleClick = () => {
		if (recordingButtonState === 'recording') {
			stopRecording();
		} else {
			startRecording();
		}
	};

	let actionButtons = [
		{
			text: 'Play',
			onClick: () => {
				playRecording();
			}
		},
		{
			text: 'Reset',
			onClick: () => {
				recordingButtonState = 'idle';
			}
		},
		{
			text: 'Transcribe',
			onClick: () => {
				transcribeRecording();
			}
		},
		{
			text: 'Save Recording',
			onClick: () => {
				saveRecording();
			}
		}
	];
</script>

<main>
	<div class="flex justify-center mt-20">
		<RecordButton {recordingButtonState} {actionButtons} {showActionButtons} {handleClick} />
	</div>

	{#if transcript}
		<div class="flex justify-center m-10 rounded-lg bg-gray-200 p-6">
			{transcript}
		</div>
	{/if}
</main>
