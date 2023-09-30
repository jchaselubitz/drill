<script lang="ts">
	import LessonSuggestions from './LessonSuggestions.svelte';
	import SubjectLevelSelector from './SubjectLevelSelector.svelte';

	let level = '';
	let language = '';
</script>

<div class="flex flex-col m-4 gap-4">
	<SubjectLevelSelector bind:language bind:level />

	{#if level && language}
		<LessonSuggestions {level} {language} />
	{/if}
</div>
