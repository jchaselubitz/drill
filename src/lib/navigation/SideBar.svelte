<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from 'svelte-awesome';
	import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
	import ApiKeyForm from './APIKeyForm.svelte';
	import SideBarItem from './SideBarItem.svelte';
	export let sidebarIsOpen: boolean;

	export let toggleSidebar: (open: boolean) => void;

	let sidebarRef: HTMLDivElement;

	let screenSize = { width: 0, height: 0 };

	onMount(() => {
		setTimeout(() => {
			updateScreenSize();
			window.addEventListener('resize', updateScreenSize);
			window.addEventListener('click', handleClickOutside);

			return () => {
				window.removeEventListener('resize', updateScreenSize);
				window.removeEventListener('click', handleClickOutside);
			};
		}, 0);
	});

	function updateScreenSize() {
		screenSize.width = window.innerWidth;
		screenSize.height = window.innerHeight;
	}

	function handleClickOutside(event) {
		if (screenSize.width <= 768) {
			// Example breakpoint for mobile devices
			if (sidebarIsOpen && sidebarRef && !sidebarRef.contains(event.target)) {
				toggleSidebar(false);
			}
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
