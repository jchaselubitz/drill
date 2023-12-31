<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { Session } from '@supabase/supabase-js';
	export let session: Session | null;

	export let submitLogout: SubmitFunction;
</script>

<div class="border-b-2 p-2 flex justify-end">
	{#if session}
		<form action="/auth/sign-out" method="POST" use:enhance={submitLogout}>
			<button class="text-sm font-medium uppercase" type="submit">Sign out</button>
		</form>
	{:else}
		<a href="/auth/sign-in">Sign in</a>
	{/if}
</div>
