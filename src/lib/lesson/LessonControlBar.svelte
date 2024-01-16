<script lang="ts">
	import cn from 'classnames';
	import { invalidate } from '$app/navigation';
	import type { Lesson } from '$src/types/primaryTypes';
	import { downloadCSV } from '$src/utils/helpersExport';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let lesson: Lesson;
	export let showLessonSettings: boolean;
	export let supabase: SupabaseClient<any, 'public', any>;

	function toggleLessonSettings() {
		showLessonSettings = !showLessonSettings;
	}

	const baseButtonClass = 'p-1 px-2 text-xs border border-blue-600 rounded-full';

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

<div class="md:flex justify-between">
	<h1 class="md:text-2xl font-bold">{lesson.title}</h1>
	<div>
		<button class={cn(baseButtonClass, ' bg-blue-600 text-white')} on:click={toggleLessonSettings}>
			{#if showLessonSettings}
				Hide Settings
			{:else}
				Show Settings
			{/if}
		</button>

		<button
			class={cn(
				baseButtonClass,
				lesson.show_side_2_first ? ' bg-blue-600 text-white ' : 'text-blue-600'
			)}
			on:click={updateSideOrder}
		>
			Show Back First
		</button>

		<button
			class={cn(baseButtonClass, ' bg-blue-600 text-white')}
			on:click={() => downloadCSV(lesson)}>Download CSV</button
		>
	</div>
</div>
