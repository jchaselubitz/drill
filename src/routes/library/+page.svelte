<script lang="ts">
	import type { PageData } from './$types';
	import Select from '$lib/inputs/Select.svelte';
	import { getLangName } from '$src/utils/lists';
	import PhraseCard from '$lib/library/PhraseCard.svelte';
	import type { Phrase, PreparedPhrase } from '$src/types/primaryTypes';

	export let data: PageData;
	$: ({ session, supabase, phrases, languages } = data);

	$: selectedLanguage = 'en';

	$: phrasesByLanguage = phrases.filter((phrase) => phrase.lang === selectedLanguage);

	$: createPhraseObjects = (phraseArray: Phrase[]): PreparedPhrase[] => {
		return phrasesByLanguage.map((phrase) => {
			const translations = phrase.correspondingTranslations.map((translation) => {
				const correspondingPhrase = phrases.filter(
					(phrase) => phrase.id === translation.correspondingPhraseId
				)[0];
				const lessonTitle = translation.lessons.title;
				const lessonLink = `subjects/${translation.lessons.subject_id}/${translation.lessons.id}`;
				return { ...correspondingPhrase, lessonTitle, lessonLink };
			});
			return { ...phrase, translations };
		});
	};

	$: sortPhrases = (phrases: PreparedPhrase[]): PreparedPhrase[] => {
		return phrases.sort((a, b) => {
			if (a.text < b.text) {
				return -1;
			}
			if (a.text > b.text) {
				return 1;
			}
			return 0;
		});
	};

	$: preparePhrasesForPresentation = (phrases: Phrase[]): PreparedPhrase[] => {
		return sortPhrases(createPhraseObjects(phrases));
	};

	$: phrasesForPresentation = preparePhrasesForPresentation(phrases);
	$: userId = session?.user?.id;

	const setLanguage = (event: Event & { detail: Event }) => {
		selectedLanguage = (event.detail.target as HTMLSelectElement).value;
	};

	let isLoading = false;
</script>

<svelte:head>
	<title>Library</title>
</svelte:head>

<div class="m-4rounded-lg">
	<h1 class="text-2xl font-bold">Words & Phrases</h1>

	{#if languages}
		<Select name="language" value={selectedLanguage} className="my-4" on:change={setLanguage}>
			{#each languages as language}
				<option value={language}>{getLangName(language)}</option>
			{/each}
		</Select>
	{/if}

	{#if phrasesForPresentation}
		<div class="flex flex-col gap-4">
			{#each phrasesForPresentation as phrase}
				<PhraseCard {phrase} {supabase} />
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.white);
	}
</style>
