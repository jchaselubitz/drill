<script lang="ts">
	import AudioPlayButton from '$lib/buttons/AudioPlayButton.svelte';
	import { playSavedAudio } from '$src/utils/helpersAudio';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import cn from 'classnames';
	import RecordingCardDetails from './RecordingCardDetails.svelte';
	import { getHumanDate } from '$src/utils/helpersDate';
	import type { Recording } from '$src/types/primaryTypes';

	export let supabase: SupabaseClient;
	export let userId: string | undefined;
	export let recording: Recording;

	let date = new Date(recording.created_at);

	$: isPlaying = false;
	$: detailsOpen = false;
	$: audioObject = null as any;

	const setIsPlayingFalse = () => {
		isPlaying = false;
	};

	async function handlePlayClick() {
		if (isPlaying) {
			audioObject.pause();
			isPlaying = false;
			return;
		}
		isPlaying = true;
		audioObject = await playSavedAudio({
			supabase,
			bucket: 'user_recordings',
			fileName: `${userId}/${recording.filename}`,
			setIsPlayingFalse
		});
	}
</script>

<div
	class={cn(
		'rounded-lg w-full',
		' hover:bg-gray-200 hover:shadow-sm focus:bg-slate-300 transition-colors duration-200 ease-in-out',
		'bg-gray-100'
	)}
>
	<button class="p-4 w-full" on:click={() => (detailsOpen = !detailsOpen)} tabindex="0">
		<div class="flex justify-between gap-2 text-left items-center">
			<div>
				<div class="text-gray-400 text-xs mb-1">{getHumanDate(date)}</div>
				<div class={cn('text-gray-700 text-sm font-bold', !detailsOpen && 'line-clamp-2')}>
					{recording.transcript}
				</div>
			</div>
			{#if !detailsOpen}
				<div class="flex justify-center">
					<AudioPlayButton handleClick={handlePlayClick} {isPlaying} />
				</div>
			{/if}
		</div>
	</button>
	{#if detailsOpen}
		<div class="px-4 pb-4">
			<RecordingCardDetails {recording} {userId} {supabase} {handlePlayClick} {isPlaying} />
		</div>
	{/if}
</div>
