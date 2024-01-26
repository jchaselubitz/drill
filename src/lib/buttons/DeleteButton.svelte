<script lang="ts">
	import Icon from 'svelte-awesome';
	import { faTrash } from '@fortawesome/free-solid-svg-icons';
	let loadingImage = '/images/loading-circle.png';
	export let isLoading: boolean;
	export let handleClick: () => void;
</script>

<button
	class="px-3 py-1 border-2 border-red-600 text-red-600 rounded-full text-sm"
	on:click|stopPropagation={handleClick}
>
	{#if isLoading}
		<span> <img src={loadingImage} alt="loading" class=" h-8 w-8 animate-spin" /></span>
	{:else}
		<Icon data={faTrash} />
	{/if}
</button>
