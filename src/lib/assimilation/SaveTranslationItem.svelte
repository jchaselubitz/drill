<script lang="ts">
	import SaveButton from '$lib/buttons/SaveButton.svelte';
	import { getLangIcon } from '$src/utils/lists';

	export let output_text: string | null;
	export let output_lang: string;
	export let input_text: string | null;
	export let input_lang: string;
	export let saveTranslation: () => Promise<void>;

	$: saved = false;

	async function handleSaveTranslation() {
		await saveTranslation();
		saved = true;
	}
</script>

<div class="flex items-center justify-between border border-gray-300 rounded p-2 hover:bg-gray-100">
	<span>{getLangIcon(output_lang)}: {output_text}</span>
	<span>{getLangIcon(input_lang)}: {input_text}</span>

	<SaveButton disabled={saved} onClick={handleSaveTranslation}
		>{saved ? 'Saved' : 'Save Translation'}</SaveButton
	>
</div>
