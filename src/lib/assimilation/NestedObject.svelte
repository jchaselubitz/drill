<script lang="ts">
	import NestedObject from './NestedObject.svelte';
	import NestedListItem from './NestedListItem.svelte';
	import type { DestinationTable } from '$src/utils/helpersDB';

	type ArbitraryObject = {
		[key: string]: any;
	};
	export let data: ArbitraryObject;
	export let command = '';
	export let parentKeys: string[] = [];
	export let saveContent: (content: string) => Promise<boolean>;

	function isObject(value: any): value is ArbitraryObject {
		return value && typeof value === 'object';
	}

	function chainParentKeys(key: string) {
		const parentKeyChain = [...parentKeys, key];
		return parentKeyChain;
	}
</script>

{#if isObject(data)}
	<ul class="flex flex-col gap-2">
		{#each Object.entries(data) as [key, value]}
			{#if isObject(value)}
				<div class="my-2">
					<strong class="capitalize">{key}:</strong>
				</div>
				<div class="ml-2 md:ml-4">
					<NestedObject data={value} parentKeys={chainParentKeys(key)} {saveContent} {command} />
				</div>
			{:else}
				<li>
					<NestedListItem {value} {parentKeys} {saveContent} {command} />
				</li>
			{/if}
		{/each}
	</ul>
{/if}
