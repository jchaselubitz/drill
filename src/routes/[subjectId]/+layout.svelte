<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ supabase, session, url } = data);
</script>

<svelte:head>
	<title>My Subjects</title>
</svelte:head>

<slot />
