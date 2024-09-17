<script lang="ts">
	import { Languages } from '$src/utils/lists';

	export let language: string;
	export let label: string | undefined;
	export let name: string;
	export let setLanguage: (lang: string) => void;
	let formClasses = 'flex flex-col gap-3 text-xs';
</script>

<div class="relative flex flex-col">
	<form class={formClasses}>
		{#if label}
			<label class="text-xs">{label}</label>
		{/if}

		<select class="text-xs" {name} bind:value={language} on:change={() => setLanguage(language)}>
			{#each Languages as language}
				<option value={language.value}>{language.name}</option>
			{/each}
		</select>
	</form>
</div>
