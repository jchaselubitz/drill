<script lang="ts">
	import type { Lesson } from '$src/types/primaryTypes';
	import { downloadCSV } from '$src/utils/helpersExport';

	export let lesson: Lesson;
	export let showLessonSettings: boolean;

	function toggleLessonSettings() {
		showLessonSettings = !showLessonSettings;
	}
</script>

<div class="md:flex justify-between">
	<h1 class="md:text-2xl font-bold">{lesson.title}</h1>
	<div>
		<button
			class="p-1 px-2 bg-blue-600 text-white text-xs rounded-full"
			on:click={toggleLessonSettings}
		>
			{#if showLessonSettings}
				Hide Settings
			{:else}
				Show Settings
			{/if}
		</button>

		<button
			class="p-1 px-2 bg-blue-600 text-white text-xs rounded-full"
			on:click={() => downloadCSV(lesson)}>Download CSV</button
		>
	</div>
</div>
