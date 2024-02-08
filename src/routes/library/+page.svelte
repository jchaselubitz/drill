<script lang="ts">
	import SortButton from '../../lib/buttons/SortButton.svelte';

	import type { PageData } from './$types';
	import Select from '$lib/inputs/Select.svelte';
	import { getLangName } from '$src/utils/lists';
	import PhraseCard from '$lib/library/PhraseCard.svelte';

	export let data: PageData;
	$: ({ session, supabase, phrases, languages } = data);

	$: selectedLanguage = 'en';
	$: asce = true;

	$: phrasesByLanguage = phrases.filter((phrase) => phrase.lang === selectedLanguage);
	$: createPhraseObjects = phrasesByLanguage.map((phrase) => {
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

	$: sortPhrases = createPhraseObjects.sort((a, b) => {
		if (a.text < b.text) {
			return asce ? -1 : 1;
		}
		if (a.text > b.text) {
			return asce ? 1 : -1;
		}
		return 0;
	});

	$: justPhrases = sortPhrases.filter((phrase) => phrase.text.trim().includes(' '));
	$: justWords = sortPhrases.filter((phrase) => !phrase.text.trim().includes(' '));

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
	<div class="flex gap-3 items-center p-2 border rounded-lg my-4">
		{#if languages}
			<Select name="language" value={selectedLanguage} className="" on:change={setLanguage}>
				{#each languages as language}
					<option value={language}>{getLangName(language)}</option>
				{/each}
			</Select>
		{/if}
		<SortButton bind:asce>Sort {asce ? 'A -> Z' : 'Z ->A'}</SortButton>
	</div>

	<div class="flex flex-col md:flex-row gap-3 w-full">
		{#if justPhrases}
			<div class="flex flex-col gap-4 w-full">
				<h2 class="text-xl font-bold">Phrases</h2>

				{#each justPhrases as phrase (phrase.id)}
					<PhraseCard {phrase} {supabase} />
				{/each}
			</div>
		{/if}

		{#if justWords}
			<div class="flex flex-col gap-4 w-full">
				<h2 class="text-xl font-bold">Words</h2>

				{#each justWords as phrase (phrase.id)}
					<PhraseCard {phrase} {supabase} />
				{/each}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.white);
	}
</style>
