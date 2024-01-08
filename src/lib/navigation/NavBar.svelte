<script lang="ts">
	import { enhance } from '$app/forms';
	import cn from 'classnames';
	import Icon from 'svelte-awesome';
	import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { Session } from '@supabase/supabase-js';

	export let session: Session | null;
	export let sidebarOpen: boolean;
	export let submitLogout: SubmitFunction;
	export let toggleSidebar: (open: boolean) => void;
</script>

<div
	class={cn(sidebarOpen ? 'justify-end' : 'justify-between', 'border-b-2 p-2 flex items-center')}
>
	{#if !sidebarOpen}
		<button on:click={() => toggleSidebar(true)}><Icon data={faBars} /></button>
	{/if}
	{#if session}
		<form action="/auth/sign-out" method="POST" use:enhance={submitLogout}>
			<button class="text-sm font-medium uppercase" type="submit">Sign out</button>
		</form>
	{:else}
		<a href="/auth/sign-in">Sign in</a>
	{/if}
</div>
