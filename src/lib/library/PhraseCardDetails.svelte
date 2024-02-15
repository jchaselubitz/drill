<script lang="ts">
	import cn from 'classnames';
	import Icon from 'svelte-awesome';
	import { faBook } from '@fortawesome/free-solid-svg-icons';
	import ContentRequest from '$lib/assimilation/ContentRequest.svelte';
	import TtsButton from '$lib/buttons/TtsButton.svelte';
	import { LanguagesISO639, getLangIcon, getLangName } from '$src/utils/lists';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let phrase;
	export let supabase: SupabaseClient;
	export let userId: string;

	let text = phrase.text;
	let lang = phrase.lang as LanguagesISO639;
	let translationsPhrases = phrase.translations;

	let primaryPhraseIds = [
		...translationsPhrases.map((phrase) => {
			return phrase.id;
		}),
		phrase.id
	];

	const bucket = 'text_to_speech';
</script>

<div>
	{#if translationsPhrases.length > 0}
		<h3>Translations:</h3>
		<ul class="flex flex-col gap-2">
			{#each translationsPhrases as translationsPhrase}
				<div class="md:flex justify-between border border-gray-400 p-2 mb-2 w-full rounded-md">
					<div class="flex items-center justify-between md:gap-2">
						{translationsPhrase.text}
						<div class="w-12">
							<TtsButton {supabase} text={translationsPhrase.text} {bucket} />
						</div>
					</div>
					<hr class="md:hidden border border-gray-500 my-1" />
					<div class="text-xs flex md:flex-col justify-between gap-3 items-center md:items-start">
						<div class="flex gap-1">
							<div>{getLangIcon(translationsPhrase.lang)}</div>
							<div>{getLangName(translationsPhrase.lang)}</div>
						</div>
						{#if translationsPhrase.lessonLink}
							<a
								class={cn(
									'flex p-1 border border-slate-700 hover:bg-slate-700 hover:text-white rounded-lg gap-1'
								)}
								href={translationsPhrase.lessonLink}
							>
								<Icon data={faBook} /> <span>{translationsPhrase.lessonTitle}</span>
							</a>{/if}
					</div>
				</div>
			{/each}
		</ul>
	{/if}
	<ContentRequest {text} {lang} {supabase} {userId} {primaryPhraseIds} source="phrase" />
</div>
