<script lang="ts">
	import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
	import Icon from 'svelte-awesome';
	export let handleUpload = async (file: File) => {};
	let fileInput: HTMLInputElement;

	function triggerFileInput() {
		fileInput.click();
	}

	async function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;
		if (files) {
			handleUpload(files[0]);
		}
	}
</script>

<input
	bind:this={fileInput}
	type="file"
	name="file"
	accept="audio/*"
	class="hidden"
	on:change={(e) => handleFileChange(e)}
/>
<button
	formaction="?/fileUpload"
	class="flex items-center justify-center w-10 h-10 rounded-full border border-gray-700"
	on:click={triggerFileInput}
>
	<Icon data={faArrowUpFromBracket} />
</button>
