<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Icon from 'svelte-awesome';
	import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
	import type { Session } from '@supabase/supabase-js';
	import ApiKeyForm from './APIKeyForm.svelte';
	import SideBarItem from './SideBarItem.svelte';
	export let session: Session | null;
	export let sidebarOpen: boolean;
	export let toggleSidebar: (open: boolean) => void;

	let sidebarRef: HTMLDivElement;

	onMount(() => {
		setTimeout(() => {
			window.addEventListener('click', handleClickOutside);
		}, 0);
	});

	onDestroy(() => {
		window.removeEventListener('click', handleClickOutside);
	});

	function handleClickOutside(event) {
		if (sidebarOpen && sidebarRef && !sidebarRef.contains(event.target)) {
			toggleSidebar(false);
		}
	}
</script>

<div
	class="absolute md:relative top-0 bottom-0 bg-gray-300 w-64 border-b-2 p-2"
	bind:this={sidebarRef}
>
	<div class="flex justify-end">
		<button on:click={() => toggleSidebar(false)}>
			<Icon data={faBars} />
		</button>
	</div>
	<div class="flex flex-col gap-3 mt-6">
		<SideBarItem text="My Subjects" path="/" />
		<SideBarItem text="Create Lesson" path="/create-lesson" />
	</div>

	<div class="absolute bottom-4 left-4 right-4"><ApiKeyForm /></div>
</div>
