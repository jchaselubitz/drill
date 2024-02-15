<script lang="ts">
	import { faPodcast } from '@fortawesome/free-solid-svg-icons';
	import Icon from 'svelte-awesome';
	export let handleUpload = async (file: File) => {};
	let fileInput: HTMLInputElement;

	function triggerFileInput() {
		console.log(fileInput.value);
	}
</script>

<input bind:this={fileInput} type="text" name="file" />
<button
	class="flex items-center justify-center w-10 h-10 rounded-full border border-gray-700"
	on:click={triggerFileInput}
>
	<Icon data={faPodcast} />
</button>
