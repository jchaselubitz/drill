<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa, type ViewType } from '@supabase/auth-ui-shared';

	export let supabase: any;
	export let view: ViewType = 'sign_in';
</script>

<div class="col-6 form-widget z-100">
	<Auth
		supabaseClient={supabase}
		appearance={{ theme: ThemeSupa, style: { input: 'color: #000' } }}
		{view}
	/>
</div>
