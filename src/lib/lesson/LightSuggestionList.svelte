<script lang="ts">
	import cn from 'classnames';
	import LightSuggestion from './LightSuggestion.svelte';
	import LoadingButton from '$lib/buttons/LoadingButton.svelte';

	export let suggestions = [] as string[];
	export let isLoading = false;
	export let handleGenerateLessonSuggestions = (): void => {};
	export let setMaterialSuggestion = (suggestion: string): void => {};

	const mainClass =
		'flex-col justify-start items-center p-4 rounded-lg border border-blue-300 bg-blue-100 bg-opacity-70 text-blue-800 font-semibold text-sm min-w-max hover:bg-opacity-100 transition-all';
</script>

<div class="flex flex-row md:flex-wrap gap-4 my-4 overflow-x-scroll">
	{#each suggestions as suggestion}
		<LightSuggestion {suggestion} {setMaterialSuggestion} />
	{/each}
	<LoadingButton
		class={cn('hidden md:flex', mainClass)}
		{isLoading}
		text="Generate suggestions based on language and level"
		loadingText="Generating..."
		onClick={handleGenerateLessonSuggestions}
		type="submit"
	/>
</div>
<div class="flex md:hidden">
	<LoadingButton
		class={cn(mainClass)}
		{isLoading}
		text="Generate suggestions based on language and level"
		loadingText="Generating..."
		onClick={handleGenerateLessonSuggestions}
		type="submit"
	/>
</div>
