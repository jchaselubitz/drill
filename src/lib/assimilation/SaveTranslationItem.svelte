<script lang="ts">
	import SaveButton from '$lib/buttons/SaveButton.svelte';

	export let text: string | null;
	export let output_lang: string;
	export let saveTranslation: () => Promise<void>;

	$: saved = false;
</script>

<div class="flex items-center justify-between border border-gray-300 rounded p-2 hover:bg-gray-100">
	<span>{text}</span>

	{output_lang}
	<SaveButton disabled={saved} onClick={saveTranslation}
		>{saved ? 'Saved' : 'Save Translation'}</SaveButton
	>
</div>
