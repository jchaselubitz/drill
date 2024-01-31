<script lang="ts">
	export let supabase: any;
	export let onCompletion = () => {};

	$: new_password = '';
	$: password_check = '';
	$: checkError = '';

	const updatePassword = async () => {
		if (new_password !== password_check) {
			checkError = 'Passwords do not match';
			return;
		}
		const { data, error } = await supabase.auth.updateUser({ password: new_password });
		if (error) {
			throw error;
		}
		if (data) {
			alert('Password updated successfully');
			onCompletion();
		}
	};
</script>

<div class="absolute bg-gray-700/70 backdrop-blur-sm top-0 bottom-0 left-0 right-0 z-100">
	<div class="relative mt-36 p-4 rounded-lg shadow-xl w-72 mx-auto z-100 bg-white">
		<form class="flex flex-col space-y-4" on:submit|preventDefault={() => updatePassword()}>
			<div class="mb-2 text-sm uppercase">Choose a new Password</div>
			<div class="flex flex-col space-y-1">
				<label for="password" class="text-sm font-semibold text-gray-600">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					bind:value={new_password}
					required
					class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
				/>
			</div>
			<div class="flex flex-col space-y-1">
				<label for="password" class="text-sm font-semibold text-gray-600">Confirm Password</label>
				<input
					type="password"
					id="password-check"
					name="password_check"
					bind:value={password_check}
					required
					class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
				/>
				{#if checkError}
					<p class="text-red-500 text-sm">{checkError}</p>
				{/if}
			</div>
			<button type="submit" class="bg-blue-600 text-white rounded-lg px-3 py-2">Submit</button>
		</form>
	</div>
</div>
