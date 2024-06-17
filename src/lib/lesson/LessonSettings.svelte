<script lang="ts">
	import DeckList from '$lib/decks/DeckList.svelte';
	import cn from 'classnames';
	import type { Lesson, Translation } from '$src/types/primaryTypes';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import GenerateMoreCards from './GenerateMoreCards.svelte';
	import { LanguagesISO639 } from '$src/utils/lists';
	import { downloadApkg, downloadCSV } from '$src/utils/helpersExport';
	import GenerateDeckAudio from './GenerateDeckAudio.svelte';
	import { getFileList } from '$src/utils/helpersAudio';
	import { hashString } from '$src/utils/helpersDB';

	export let lesson: Lesson;
	export let userId: string | undefined;
	export let supabase: SupabaseClient<any, 'public', any>;
	const translations = lesson.translations;
	const userLanguage = LanguagesISO639.English;
	const studyLanguage = lesson.translations[0].phrase_secondary_id.lang as LanguagesISO639;
	const bucket = 'text_to_speech';

	$: translationsWithoutAudio = [] as (Translation | undefined)[];

	const getTranslationsWithoutAudio = async () => {
		const fileList = (await getFileList({ supabase, bucket })).map((file) => file.name);
		const withoutAudio = await Promise.all(
			translations.map(async (translation) => {
				const text = translation.phrase_secondary_id.text as string;
				const fileName = ((await hashString(text as string)) + '.mp3') as string;
				if (!fileList.includes(fileName)) {
					return translation;
				}
			})
		);

		translationsWithoutAudio = withoutAudio.filter(Boolean);
	};

	getTranslationsWithoutAudio();

	const baseButtonClass = 'w-full rounded-lg text-white p-2';

	$: loadingCSV = false;
	$: loadingAPKG = false;

	function setLoadingFalse() {
		loadingCSV = false;
		loadingAPKG = false;
	}
</script>

<div class="flex flex-col">
	<hr class="border-gray-300 my-5" />
	<div class="flex flex-col md:flex-row w-full items-center justify-around gap-3">
		<div class="flex gap-2 w-full">
			<button
				class={cn(baseButtonClass, ' bg-blue-600 text-white')}
				on:click={() => {
					(loadingCSV = true), downloadCSV(lesson, setLoadingFalse);
				}}>{loadingCSV === true ? 'Downloading' : 'Download CSV'}</button
			>
			<button
				class={cn(baseButtonClass, ' bg-blue-600 text-white')}
				on:click={() => {
					(loadingAPKG = true), downloadApkg(lesson, setLoadingFalse);
				}}>{loadingAPKG === true ? 'Downloading' : 'Download APKG'}</button
			>
		</div>
		<GenerateMoreCards
			{userId}
			lessonId={lesson.id}
			lessonTitle={lesson.title}
			{studyLanguage}
			{userLanguage}
			currentLevel={lesson.subjects.current_level}
			{supabase}
		/>
		{#if translationsWithoutAudio.length > 0}
			<GenerateDeckAudio
				translations={translationsWithoutAudio}
				{supabase}
				{bucket}
				updateAudioStatuses={getTranslationsWithoutAudio}
			/>
		{/if}
	</div>
	<hr class="border-gray-300 my-5" />

	<DeckList cards={lesson.translations} {bucket} {supabase} {translationsWithoutAudio} />
</div>
