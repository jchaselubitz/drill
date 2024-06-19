<script lang="ts">
	import cn from 'classnames';
	import { invalidate } from '$app/navigation';
	import type { Lesson } from '$src/types/primaryTypes';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let lesson: Lesson;
	// export let showLessonSettings: boolean;
	export let supabase: SupabaseClient<any, 'public', any>;
	$: showTitleEditor = false;

	function toggleShowTitleEditor(setting: boolean) {
		showTitleEditor = setting;
	}

	// function toggleLessonSettings() {
	// 	showLessonSettings = !showLessonSettings;
	// }

	// const baseButtonClass = 'p-1 px-2 text-xs border border-blue-600 rounded-full';

	// async function updateSideOrder() {
	// 	const showSide2First = !lesson.show_side_2_first;
	// 	const { error } = await supabase
	// 		.from('lessons')
	// 		.update({ show_side_2_first: showSide2First })
	// 		.eq('id', lesson.id);
	// 	invalidate('app:lesson');
	// 	if (error) {
	// 		throw Error(`${'Failed to update card status:'} ${error.message}`);
	// 	}
	// }

	async function updateLessonTitle(newTitle: string) {
		const { data, error } = await supabase
			.from('lessons')
			.update({ title: newTitle })
			.eq('id', lesson.id);
		if (error) {
			throw Error(`${'Failed to update lesson title:'} ${error.message}`);
		}
		invalidate('app:lesson');
	}
</script>

<div class="md:flex justify-between">
	<button
		class="md:text-2xl font-bold hover:underline"
		on:click={() => toggleShowTitleEditor(true)}
	>
		{#if showTitleEditor}
			<input
				type="text"
				value={lesson.title}
				on:blur={(e) => {
					updateLessonTitle(e.target.value);
					toggleShowTitleEditor(false);
				}}
			/>
		{:else}
			{lesson.title}
		{/if}
	</button>
	<div>
		<!-- <button class={cn(baseButtonClass, ' bg-blue-600 text-white')} on:click={toggleLessonSettings}>
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
		</button> -->
	</div>
</div>
