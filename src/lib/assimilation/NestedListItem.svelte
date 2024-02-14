<script lang="ts">
	import SaveButton from '$lib/buttons/SaveButton.svelte';
	import type { DestinationTable } from '$src/utils/helpersDB';
	export let value: any;
	export let parentKeys: string[] = [];
	export let command = '';
	export let saveContent: (content: string) => Promise<boolean>;

	$: saved = false;
	// console.log('parentKeys:', parentKeys);
</script>

<div class="flex items-center justify-between border border-gray-300 rounded p-2 hover:bg-gray-100">
	<span>{value}</span>
	<!-- svelte-ignore missing-declaration -->
	{#if command !== 'Explain'}
		<SaveButton disabled={saved} onClick={() => saveContent(value)}
			>{saved ? 'Saved' : 'Save'}</SaveButton
		>
	{/if}
</div>
