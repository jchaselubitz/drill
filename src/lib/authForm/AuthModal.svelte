<script lang="ts">
	import AuthForm from './AuthForm.svelte';

	export let supabase: any;
	export let url: string;
</script>

<div class="absolute bg-gray-700/70 backdrop-blur-sm top-0 bottom-0 left-0 right-0">
	<div class="relative mt-36 p-4 rounded-lg shadow-xl w-72 mx-auto z-10 bg-white">
		<AuthForm {supabase} {url} />
	</div>
</div>
