<script lang="ts">
	import SaveButton from '$lib/buttons/SaveButton.svelte';
	import type { DestinationTable } from '$src/utils/helpersDB';
	export let value: any;
	export let parentKeys: string[] = [];
	export let saveContent: (dest_table: DestinationTable, content: string) => Promise<boolean>;

	$: saved = false;
	// console.log('parentKeys:', parentKeys);

	async function handleSave(value: any) {
		const cleanValue = value.trim();
		const dest_table = 'phrases';
		saved = await saveContent(dest_table, value);
	}
</script>

<div class="flex items-center justify-between border border-gray-300 rounded p-2 hover:bg-gray-100">
	<span>{value}</span>
	<!-- svelte-ignore missing-declaration -->
	<SaveButton disabled={saved} onClick={() => handleSave(value)}
		>{saved ? 'Saved' : 'Save'}</SaveButton
	>
</div>
