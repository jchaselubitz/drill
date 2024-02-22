<script lang="ts">
	import LoadingButton from '$lib/buttons/LoadingButton.svelte';
	import { faScissors } from '@fortawesome/free-solid-svg-icons';
	import audioBufferToWav from 'audiobuffer-to-wav';
	import Icon from 'svelte-awesome';

	let modalRef: HTMLDivElement;
	let isOpen = false;

	function openModal() {
		isOpen = true;
		setTimeout(() => {
			window.addEventListener('click', handleClickOutside);
		}, 0);
	}

	function closeModal() {
		window.removeEventListener('click', handleClickOutside);
		isOpen = false;
	}

	function handleClickOutside(event: any) {
		if (modalRef && !modalRef.contains(event.target)) {
			closeModal();
		}
	}

	export let maxDuration = 120;
	export let audioResponse: { blob: Blob; url: string };
	export let audioDuration = 0;

	$: origAudioBlob = audioResponse?.blob ?? null;

	$: startTimeClock = secondsToClock(0);
	$: endTimeClock = secondsToClock(audioDuration);
	$: startTime = clockToSeconds(startTimeClock);
	$: endTime = clockToSeconds(endTimeClock);
	$: isTrimming = false;

	$: newAudioBlob = null as null | Blob;
	$: newAudioURL = null as null | string;
	$: newAudioDuration = endTime - startTime;

	function secondsToClock(seconds: number) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	function clockToSeconds(clock: string) {
		const [minutes, seconds] = clock.split(':').map(Number);
		return minutes * 60 + seconds;
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

		if (startTime + endTime > maxDuration) {
			alert(`Trimmed audio cannot exceed ${maxDuration} minutes`);
			return false;
		}
		return true;
	}

	async function trimAudioBlob() {
		const audioContext = new (window.AudioContext || window.AudioContext)();
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
		closeModal();
	}
</script>

{#if isOpen}
	<div class="fixed top-0 bottom-0 left-0 right-0 p-3 bg-gray-800 bg-opacity-40 z-20">
		<div
			class="rounded-lg p-4 mt-10 mx-auto bg-white w-full md:w-96 flex flex-col gap-2"
			bind:this={modalRef}
		>
			{#if newAudioURL}
				<audio src={newAudioURL} controls />
			{/if}
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
			<LoadingButton
				class="bg-blue-600 rounded-lg text-white p-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={isTrimming || Math.floor(audioDuration) === newAudioDuration}
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
	</div>
{:else}
	<button
		class="flex items-center justify-center w-10 h-10 rounded-full border border-gray-700"
		on:click={openModal}
	>
		<Icon data={faScissors} />
	</button>
{/if}
