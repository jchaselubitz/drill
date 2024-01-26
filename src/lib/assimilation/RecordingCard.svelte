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

	$: playLoading = false;
	$: detailsOpen = false;

	const setIsloadingFalse = () => {
		playLoading = false;
	};

	async function playRecording() {
		playLoading = true;
		await playSavedAudio({
			supabase,
			bucket: 'user_recordings',
			fileName: `${userId}/${recording.filename}`,
			setIsloadingFalse
		});
	}
</script>

<button
	on:click={() => (detailsOpen = !detailsOpen)}
	tabindex="0"
	class={cn(
		'p-4 rounded-lg w-full',
		' hover:bg-gray-200 hover:shadow-sm focus:bg-slate-300 transition-colors duration-200 ease-in-out',
		'bg-gray-100'
	)}
>
	<div class="flex justify-between gap-2 text-left items-center">
		<div>
			<div class="text-gray-400 text-xs mb-1">{getHumanDate(date)}</div>
			<div class={cn('text-gray-700 text-sm font-bold', !detailsOpen && 'line-clamp-2')}>
				{recording.transcript}
			</div>
		</div>
		{#if !detailsOpen}
			<div class="flex justify-center">
				<AudioPlayButton handleClick={playRecording} isLoading={playLoading} />
			</div>
		{/if}
	</div>

	{#if detailsOpen}
		<RecordingCardDetails {recording} {supabase} {playRecording} {playLoading} />
	{/if}
</button>
