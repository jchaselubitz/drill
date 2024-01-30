<script lang="ts">
	import '../app.css';
	import cn from 'classnames';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import NavBar from '$lib/navigation/NavBar.svelte';
	import type { PageData } from './$types';
	import { type SubmitFunction } from '@sveltejs/kit';
	import AuthModal from '$lib/authForm/AuthModal.svelte';
	import SideBar from '$lib/navigation/SideBar.svelte';
	import AuthForm from '$lib/authForm/AuthForm.svelte';

	export let data: PageData;

	$: ({ supabase, session, pathname } = data);
	$: sidebarIsOpen = undefined as boolean | undefined;
	$: isPublic = pathname.includes('password-reset');

	onMount(() => {
		sidebarIsOpen = localStorage.getItem('sidebarIsOpen') === 'true';
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

	const toggleSidebar = () => {
		localStorage.setItem('sidebarIsOpen', (!sidebarIsOpen).toString());
		sidebarIsOpen = !sidebarIsOpen;
	};
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

{#if sidebarIsOpen !== undefined}
	<div class="flex absolute top-0 bottom-0 w-full">
		{#if sidebarIsOpen && session}
			<SideBar {sidebarIsOpen} {toggleSidebar} />
		{/if}
		{#if !session && !isPublic}
			<AuthModal {supabase} />
		{/if}
		<div class={cn(sidebarIsOpen && !isPublic && 'md:ml-64', 'flex flex-col w-full')}>
			{#if !isPublic}
				<NavBar {session} {sidebarIsOpen} {toggleSidebar} {submitLogout} />
			{/if}
			<div class="p-1 md:p-4 w-full h-full">
				<slot />
			</div>
		</div>
	</div>
{/if}
