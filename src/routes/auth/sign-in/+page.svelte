<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import type { PageData } from './$types';
	export let data: PageData;

	$: ({ supabase, session } = data);
</script>

<svelte:head>
	<title>Drill</title>
</svelte:head>

<div class="m-4rounded-lg">
	<div class="col-6 form-widget">
		<Auth
			supabaseClient={supabase}
			view="magic_link"
			redirectTo={`${data.url}/auth/callback`}
			showLinks={false}
			appearance={{ theme: ThemeSupa, style: { input: 'color: #000' } }}
		/>
	</div>
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.white);
	}
</style>
