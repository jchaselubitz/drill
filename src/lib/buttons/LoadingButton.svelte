<script lang="ts">
	let loadingImage = '/images/loading-circle.png';
	export let text: string;
	export let loadingText: string;
	export let isLoading: boolean;
	export let onClick = () => {}; // Default no-op function
</script>

<button {...$$restProps} type="submit" on:click={onClick}>
	<div class="flex items-center justify-center gap-4">
		{isLoading ? loadingText : text}
		{#if isLoading}
			<div class="flex items-center h-0">
				<img src={loadingImage} alt={loadingText} class="h-5 w-5 animate-spin" />
			</div>
		{/if}
	</div>
</button>
