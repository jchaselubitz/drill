<script lang="ts">
	import cn from 'classnames';
	import type { ActionButtonType, RecordButtonStateType } from './types';
	export let recordingButtonState: RecordButtonStateType;
	export let handleClick: () => void;
	let loadingImage = '/images/loading-circle.png';

	$: isRecording = recordingButtonState === 'recording';
	$: isTranscribing = recordingButtonState === 'transcribing';
	$: isDisabled = recordingButtonState === 'disabled';
</script>

<div class="flex items-center justify-center gap-4">
	<button
		class={cn(
			isDisabled ? 'cursor-default' : 'cursor-pointer',
			'flex items-center justify-center h-20 w-20 rounded-full border-2',
			isDisabled ? 'border-gray-400' : isTranscribing ? 'border-blue-700' : 'border-red-500'
		)}
		on:click|stopPropagation={handleClick}
	>
		{#if isRecording}
			<div class="h-12 w-12 bg-red-500 rounded-lg" />
		{:else if isTranscribing}
			<img src={loadingImage} alt="loading" class=" h-16 w-16 animate-spin" />
		{:else if isDisabled}
			<div class="h-14 w-14 bg-gray-400 rounded-full" />
		{:else}
			<div class="h-14 w-14 bg-red-500 rounded-full" />
		{/if}
	</button>
</div>
