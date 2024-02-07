<script lang="ts">
	import ContentRequest from '$lib/assimilation/ContentRequest.svelte';
	import type { Phrase } from '$src/types/primaryTypes';
	import { LanguagesISO639, getLangName } from '$src/utils/lists';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let phrase;
	export let supabase: SupabaseClient;

	let text = phrase.text;
	let lang = phrase.lang as LanguagesISO639;
	let translationsPhrases = phrase.translations;
</script>

<div>
	{#if translationsPhrases}
		<h3>Translations:</h3>
		<ul class="flex flex-col gap-2">
			{#each translationsPhrases as translationsPhrase}
				<div class="flex justify-between border border-gray-400 p-2 mb-2 w-full">
					<div>{translationsPhrase.text}</div>
					<div>{getLangName(translationsPhrase.lang)}</div>
					<a href={translationsPhrase.lessonLink}>{translationsPhrase.lessonTitle}</a>
				</div>
			{/each}
		</ul>
	{/if}
	<ContentRequest {text} {lang} {supabase} source="phrase" />
</div>
