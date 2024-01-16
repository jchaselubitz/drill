<script lang="ts">
	export let suggestion: string;
	export let setMaterialSuggestion = (suggestion: string): void => {};
</script>

<button
	class="flex flex-col justify-start p-4 rounded-lg border border-gray-200 bg-slate-100 bg-opacity-50 text-slate-800 font-semibold text-sm min-w-max hover:bg-opacity-100 transition-all"
	on:click={() => setMaterialSuggestion(suggestion)}
>
	<p class="text-xs opacity-50 mb-1">Suggestion:</p>

	<p>"{suggestion}"</p>
</button>
