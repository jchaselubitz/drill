<script lang="ts">
	export let message: string = 'Password Reset';
</script>

<main>
	<h1>{message}</h1>
</main>

<style>
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	h1 {
		font-size: 24px;
		text-align: center;
	}
</style>
