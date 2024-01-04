<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import NavBar from '$lib/navigation/NavBar.svelte';
	import type { PageData } from './$types';
	import { redirect, type SubmitFunction } from '@sveltejs/kit';
	import AuthModal from '$lib/authForm/AuthModal.svelte';
	import SideBar from '$lib/navigation/SideBar.svelte';

	export let data: PageData;

	$: ({ supabase, session, url } = data);
	$: sidebarOpen = false;

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

	const handleSidebar = () => {
		sidebarOpen = !sidebarOpen;
	};
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

<div class="flex absolute top-0 bottom-0 w-full">
	{#if !session}
		<AuthModal {supabase} {url} />
	{/if}
	{#if sidebarOpen}
		<SideBar {session} {handleSidebar} />
	{/if}
	<div class="flex flex-col w-full">
		<NavBar {session} {sidebarOpen} {handleSidebar} {submitLogout} />
		<div class="p-4 w-full">
			<slot />
		</div>
	</div>
</div>
