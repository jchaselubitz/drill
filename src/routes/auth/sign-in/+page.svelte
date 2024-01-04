<script lang="ts">
	import type { PageData } from './$types';
	import AuthModal from '$lib/authForm/AuthModal.svelte';
	export let data: PageData;

	$: ({ supabase, url } = data);
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

<div class="m-4rounded-lg">
	<AuthModal {supabase} {url} />
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.white);
	}
</style>
