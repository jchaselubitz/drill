<script lang="ts">
	import Recording from '$lib/assimilation/Recording.svelte';
	import RecordingCard from '$lib/assimilation/RecordingCard.svelte';
	import Transcript from '$lib/assimilation/Transcript.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ recordings, supabase, session } = data);
	$: userId = session?.user.id;
	$: transcript = '';
</script>

<main>
	<Recording {supabase} {userId} bind:transcript />

	{#if transcript}
		<Transcript {transcript} />
	{/if}

	{#if recordings}
		<hr class="my-10" />
		<div class="flex flex-col justify-between items-center gap-3 m-2">
			{#each recordings as recording}
				<RecordingCard {recording} {supabase} {userId} />
			{/each}
		</div>
	{/if}
</main>

<!-- <div>List of expandible cards for each recording</div>
	<div>deleting should delete recording and transcript</div> -->
