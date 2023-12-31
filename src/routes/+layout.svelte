<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import NavBar from '$lib/navbar/index.svelte';
	import type { PageData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let data: PageData;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		async function getUser() {
			const { error } = await supabase.auth.getUser(session?.access_token);
			if (error) {
				console.error('Error: ', error.message);
				supabase.auth.signOut();
			}
		}
		getUser();

		return () => data.subscription.unsubscribe();
	});

	const submitLogout: SubmitFunction = async ({ cancel }) => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
		cancel();
	};
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

<div>
	<NavBar {session} {submitLogout} />
	<slot />
</div>
