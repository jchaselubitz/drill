<script lang="ts">
	import Icon from 'svelte-awesome';
	import { faPlay } from '@fortawesome/free-solid-svg-icons';
	let loadingImage = '/images/loading-circle.png';
	export let isLoading: boolean;
	export let handleClick: () => void;
</script>

<button
	class="flex items-center justify-center gap-2 h-10 w-10 text-blue-600 transition-colors duration-150 border-2 border-blue-600 rounded-full active:bg-blue-600 hover:bg-blue-700 hover:text-white focus:outline-none focus:shadow-outline-blue"
	on:click|stopPropagation={handleClick}
	disabled={isLoading}
>
	{#if isLoading}
		<span> <img src={loadingImage} alt="loading" class=" h-8 w-8 animate-spin" /></span>
	{:else}
		<Icon data={faPlay} />
	{/if}
</button>
