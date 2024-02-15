<script lang="ts">
	import SaveButton from '$lib/buttons/SaveButton.svelte';
	export let value: any;
	export let parentKeys: string[] = [];
	export let command = '';
	export let saveContent: (content: string) => Promise<boolean>;

	$: saved = false;

	async function handleSave(content: string) {
		const success = await saveContent(content);
		if (success) {
			saved = true;
		}
	}
	// console.log('parentKeys:', parentKeys);
</script>

<div class="flex items-center justify-between border border-gray-300 rounded p-2 hover:bg-gray-100">
	<span>{value}</span>
	<!-- svelte-ignore missing-declaration -->
	{#if command !== 'Explain'}
		<SaveButton
			disabled={saved}
			onClick={() => {
				handleSave(value);
			}}>{saved ? 'Saved' : 'Save'}</SaveButton
		>
	{/if}
</div>
