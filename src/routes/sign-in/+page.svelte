<script type="ts">
	import SignIn from 'clerk-sveltekit/client/SignIn.svelte';
</script>

<div class="flex items-center justify-center mt-16">
	<SignIn afterSignInUrl="/admin" />
</div>
