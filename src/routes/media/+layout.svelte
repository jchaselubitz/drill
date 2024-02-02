<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	$: ({ supabase, session, url } = data);
</script>

<svelte:head>
	<title>Create Lesson</title>
</svelte:head>
<slot />
