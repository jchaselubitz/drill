<script lang="ts">
	import DeckList from '$lib/decks/DeckList.svelte';
	import type { Lesson } from '$src/types/primaryTypes';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import GenerateMoreCards from './GenerateMoreCards.svelte';
	import { invalidate } from '$app/navigation';

	export let lesson: Lesson;
	export let userId: string | undefined;
	export let supabase: SupabaseClient<any, 'public', any>;

	async function updateSideOrder() {
		const showSide2First = !lesson.show_side_2_first;
		const { error } = await supabase
			.from('lessons')
			.update({ show_side_2_first: showSide2First })
			.eq('id', lesson.id);
		invalidate('app:lesson');
		if (error) {
			throw Error(`${'Failed to update card status:'} ${error.message}`);
		}
	}
</script>

<div class="flex flex-col">
	<hr class="border-gray-300 my-5" />
	<div class="flex w-full items-center justify-around">
		<GenerateMoreCards
			{userId}
			lessonId={lesson.id}
			lessonTitle={lesson.title}
			subjectLanguage={lesson.subjects.name}
			userLanguage={'English'}
			currentLevel={lesson.subjects.current_level}
			{supabase}
		/>
		<label for="show_side_2_first">
			<input type="checkbox" bind:checked={lesson.show_side_2_first} on:click={updateSideOrder} />
			Show Back First</label
		>
	</div>
	<hr class="border-gray-300 my-5" />

	<DeckList cards={lesson.cards} {supabase} />
</div>
