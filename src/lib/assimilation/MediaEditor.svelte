<script lang="ts">
	import audioBufferToWav from 'audiobuffer-to-wav';
	import LoadingButton from '$lib/buttons/LoadingButton.svelte';

	export let audioResponse: { blob: Blob; url: string };

	$: origAudioBlob = audioResponse?.blob ?? null;
	$: origAudioURL = audioResponse?.url ?? null;

	$: startTimeClock = secondsToClock(0);
	$: endTimeClock = secondsToClock(0);
	$: startTime = clockToSeconds(startTimeClock);
	$: endTime = clockToSeconds(endTimeClock);
	$: isTrimming = false;

	$: newAudioBlob = null as null | Blob;
	$: newAudioURL = null as null | string;

	let audioDuration = 0; // You'll need to update this with the audio's duration

	function secondsToClock(seconds: number) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	function clockToSeconds(clock: string) {
		const [minutes, seconds] = clock.split(':').map(Number);
		return minutes * 60 + seconds;
	}

	function loadAudioDuration() {
		const audio = new Audio(origAudioURL);
		audio.onloadedmetadata = () => {
			audioDuration = audio.duration;
			endTimeClock = secondsToClock(audioDuration);
		};
	}

	$: if (origAudioURL) {
		loadAudioDuration();
	}

	async function trimAudioBlob() {
		const audioContext = new (window.AudioContext || window.webkitAudioContext)();
		const arrayBuffer = await origAudioBlob.arrayBuffer();
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

		// Set endTime to audio duration if it exceeds it
		if (endTime === 0 || endTime > audioBuffer.duration) {
			endTime = audioBuffer.duration;
		}

		const startFrame = Math.round(startTime * audioBuffer.sampleRate);
		const endFrame = Math.round(endTime * audioBuffer.sampleRate);

		// Create a new AudioBuffer for the trimmed section
		const trimmedAudioBuffer = audioContext.createBuffer(
			audioBuffer.numberOfChannels,
			endFrame - startFrame,
			audioBuffer.sampleRate
		);

		// Copy the trimmed section of each channel into the new AudioBuffer
		for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
			const trimmingData = audioBuffer.getChannelData(channel).slice(startFrame, endFrame);
			trimmedAudioBuffer.copyToChannel(trimmingData, channel);
		}

		const wavArrayBuffer = audioBufferToWav(trimmedAudioBuffer);
		const trimmedAudioBlob = new Blob([wavArrayBuffer], { type: 'audio/wav' });

		return trimmedAudioBlob;
	}

	function validateTime() {
		const startClockSplit = startTimeClock.split(':');
		const endClockSplit = endTimeClock.split(':');
		if (
			!startTimeClock.includes(':') ||
			startClockSplit.length !== 2 ||
			!endTimeClock.includes(':') ||
			endClockSplit.length !== 2 ||
			startClockSplit[1].length > 2 ||
			endClockSplit[1].length > 2
		) {
			alert('Please enter a valid time in the format mm:ss');
			return false;
		}

		if (startTime > endTime) {
			alert('Start time cannot be greater than end time');
			return false;
		}

		if (startTime + endTime > 180) {
			alert('Trimmed audio cannot exceed 3 minutes');
			return false;
		}
		return true;
	}

	async function handleTrim() {
		if (!validateTime()) return;
		isTrimming = true;
		const trimmedAudioBlob = await trimAudioBlob();
		newAudioBlob = trimmedAudioBlob;
		newAudioURL = URL.createObjectURL(trimmedAudioBlob);
		isTrimming = false;
	}

	function handleSubmit() {
		audioResponse = { blob: newAudioBlob as Blob, url: newAudioURL as string };
	}
</script>

<div class="flex flex-col gap-3">
	<audio src={origAudioURL} controls />
	<div class="flex flex-row gap-3">
		<label>
			Start:
			<input
				class="rounded-md w-20"
				type="text"
				min="0"
				bind:value={startTimeClock}
				on:blur={() => clockToSeconds(startTimeClock)}
			/>
		</label>
		<label>
			End:
			<input
				class="rounded-md w-20"
				type="text"
				min="0"
				bind:value={endTimeClock}
				on:blur={() => clockToSeconds(endTimeClock)}
			/>
		</label>
	</div>
	{#if newAudioURL}
		<audio src={newAudioURL} controls />
	{/if}
	<LoadingButton
		class="bg-blue-600 rounded-lg text-white p-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
		disabled={isTrimming}
		isLoading={isTrimming}
		text={'Trim'}
		loadingText="Trimming..."
		onClick={handleTrim}
	/>
	<LoadingButton
		class="bg-blue-600 rounded-lg text-white p-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
		disabled={!newAudioURL}
		isLoading={false}
		text={'Save'}
		loadingText="Saving..."
		onClick={handleSubmit}
	/>
</div>
