<script lang="ts">
	import DeckList from '$lib/decks/DeckList.svelte';
	import type { Lesson } from '$src/types/primaryTypes';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import GenerateMoreCards from './GenerateMoreCards.svelte';
	import { LanguagesISO639 } from '$src/utils/lists';

	export let lesson: Lesson;
	export let userId: string | undefined;
	export let supabase: SupabaseClient<any, 'public', any>;
</script>

<div class="flex flex-col">
	<hr class="border-gray-300 my-5" />
	<div class="flex w-full items-center justify-around">
		<GenerateMoreCards
			{userId}
			lessonId={lesson.id}
			lessonTitle={lesson.title}
			subjectLanguage={lesson.subjects.name}
			userLanguage={LanguagesISO639.English}
			currentLevel={lesson.subjects.current_level}
			{supabase}
		/>
	</div>
	<hr class="border-gray-300 my-5" />

	<DeckList cards={lesson.translations} {supabase} />
</div>
