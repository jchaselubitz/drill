<script lang="ts">
	import type { ViewType } from '@supabase/auth-ui-shared';
	import AuthForm from './AuthForm.svelte';

	export let supabase: any;
	export let view: ViewType = 'sign_in';
</script>

<div class="absolute bg-gray-700/70 backdrop-blur-sm top-0 bottom-0 left-0 right-0 z-100">
	<div class="relative mt-36 p-4 rounded-lg shadow-xl w-72 mx-auto z-100 bg-white">
		<AuthForm {supabase} {view} />
	</div>
</div>
