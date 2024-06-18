<script lang="ts">
	import Select from '$lib/inputs/Select.svelte';
	import { Languages } from '$src/utils/lists';

	export let userLanguage: string;
	export let setUserLanguage: (lang: string) => void;
	let formClasses = 'flex flex-col gap-3 text-xs';
</script>

<div class="relative flex flex-col">
	<form class={formClasses}>
		<select
			class="text-xs"
			name="language"
			bind:value={userLanguage}
			on:change={() => setUserLanguage(userLanguage)}
		>
			{#each Languages as language}
				<option value={language.value}>{language.name}</option>
			{/each}
		</select>
	</form>
</div>
