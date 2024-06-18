<script lang="ts">
	import '../app.css';
	import cn from 'classnames';
	import { invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import NavBar from '$lib/navigation/NavBar.svelte';
	import type { PageData } from './$types';
	import { error, type SubmitFunction } from '@sveltejs/kit';
	import AuthModal from '$lib/authForm/AuthModal.svelte';
	import SideBar from '$lib/navigation/SideBar.svelte';
	import AuthUpdate from '$lib/authForm/AuthUpdate.svelte';

	const registerServiceWorker = () => {
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', () => {
				navigator.serviceWorker.register('/service-worker.js').then(
					(registration) => {
						console.log('ServiceWorker registration successful with scope: ', registration.scope);
					},
					(error) => {
						console.log('ServiceWorker registration failed: ', error);
					}
				);
			});
		}
	};

	export let data: PageData;

	$: ({ supabase, session, pathname, code, userLanguage } = data);
	$: sidebarIsOpen = undefined as boolean | undefined;
	$: isPublic = pathname.includes('password-reset');

	const insertUserLanguage = async () => {
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (user && userLanguage === 'none') {
			const userId = user.id;
			const userLanguages = navigator.languages;
			const primaryLanguage = userLanguages[0].split('-')[0];

			const { error } = await supabase
				.from('profiles')
				.insert({ user_id: userId, language: primaryLanguage });

			if (error) {
				console.error('Error: ', error);
			}
		}
		if (error) {
			console.error('Error: ', error);
		} else {
			invalidateAll();
		}
	};

	onMount(() => {
		registerServiceWorker();
		insertUserLanguage();
		sidebarIsOpen = localStorage.getItem('sidebarIsOpen') === 'true';
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		async function getUser() {
			const {
				data: { user },
				error
			} = await supabase.auth.getUser(session?.access_token);
			if (user) {
				return;
			}
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

	const passwordUpdateComplete = () => {
		code = null;
	};

	const setUserLanguage = async (lang: string) => {
		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (!user) {
			return;
		}
		const { error } = await supabase
			.from('profiles')
			.update({ language: lang })
			.eq('user_id', user.id);
		if (error) {
			console.error('Error: ', error);
		} else {
			invalidateAll();
		}
	};
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

{#if sidebarIsOpen !== undefined}
	<div class="flex absolute top-0 bottom-0 w-full">
		{#if sidebarIsOpen && session}
			<SideBar {sidebarIsOpen} {toggleSidebar} {userLanguage} {setUserLanguage} />
		{/if}
		<!-- {#if code}
			<AuthUpdate {supabase} onCompletion={passwordUpdateComplete} />
		{/if} -->
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
