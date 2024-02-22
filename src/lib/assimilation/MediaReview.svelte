<script lang="ts">
	import LoadingButton from '$lib/buttons/LoadingButton.svelte';
	import Button from '$lib/buttons/Button.svelte';
	import TrimAudio from './TrimAudio.svelte';

	export let audioResponse: { blob: Blob; url: string };
	export let transcriptionLoading = false;
	export let transcribeRecording = async () => {};
	export let saveRecording = async () => {};
	export let resetRecordingButtonState = () => {};
	export let isTranscript = false;

	const maxDuration = 120;
	let audioDuration = 0;
	$: origAudioURL = audioResponse.url ?? null;

	function loadAudioDuration() {
		const audio = new Audio(origAudioURL);
		audio.onloadedmetadata = () => {
			// WILD SHIT TO MAKE DURATION WORK CONSISTENTLY ON CHROME https://stackoverflow.com/questions/21522036/html-audio-tag-duration-always-infinity
			if (audio.duration === Infinity) {
				audio.addEventListener(
					'durationchange',
					function (e) {
						console.log('audioDuration', this.duration);
						if (this.duration) {
							audioDuration = audio.duration;
							audio.remove();
						}
					},
					false
				);
				audio.currentTime = 24 * 60 * 60;
				audio.volume = 0;
				audio.play();
			} else {
				audioDuration = audio.duration;
			}
		};
	}

	$: if (origAudioURL) {
		loadAudioDuration();
	}
</script>

<div class="flex flex-col gap-3">
	<div class="flex gap-2 items-center">
		{#if origAudioURL}
			<audio src={origAudioURL} controls />
			<TrimAudio bind:audioResponse bind:audioDuration {maxDuration} />
		{/if}
	</div>

	{#if isTranscript}
		<Button onClick={saveRecording}>Save Recording</Button>
	{:else}
		<LoadingButton
			class="bg-blue-600 rounded-lg text-white p-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
			disabled={audioDuration > maxDuration}
			isLoading={transcriptionLoading}
			text={audioDuration > maxDuration ? `Transcribe (max ${maxDuration} minutes)` : 'Transcribe'}
			loadingText="Transcribing..."
			onClick={transcribeRecording}
		/>
	{/if}
	<Button onClick={resetRecordingButtonState}>Reset</Button>
</div>
