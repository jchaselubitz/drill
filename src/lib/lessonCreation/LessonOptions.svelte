<script lang="ts">
	import type { Option } from './types';
	import LessonOption from './LessonOption.svelte';

	export let options: Option[];
	export let userLanguage: string;
	export let subjectLanguage: string;
	export let currentLevel: string;
	let selectedLessons: Option[] = [];
</script>

<div class="flex flex-col gap-4 prose">
	{#each options as option}
		<LessonOption {option} {subjectLanguage} {selectedLessons} {userLanguage} {currentLevel} />
	{/each}
</div>
