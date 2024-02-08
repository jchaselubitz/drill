<script lang="ts">
	import cn from 'classnames';
	import type { Phrase, PreparedPhrase } from '$src/types/primaryTypes';
	import PhraseCardDetails from './PhraseCardDetails.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import TtsButton from '$lib/buttons/TtsButton.svelte';

	export let phrase: PreparedPhrase;
	export let supabase: SupabaseClient;

	const bucket = 'text_to_speech';

	let detailsOpen = false;
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
			<h3>{phrase.text}</h3>
			<div class="w-12">
				<TtsButton {supabase} text={phrase.text} {bucket} />
			</div>
		</div>
	</button>
	{#if detailsOpen}
		<div class="p-4">
			<PhraseCardDetails {phrase} {supabase} />
		</div>
	{/if}
</div>
