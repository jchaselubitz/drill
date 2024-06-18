<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from 'svelte-awesome';
	import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
	import ApiKeyForm from './APIKeyForm.svelte';
	import SideBarItem from './SideBarItem.svelte';
	import BaseLanguageForm from './BaseLanguageForm.svelte';
	export let sidebarIsOpen: boolean;

	export let toggleSidebar: (open: boolean) => void;
	export let userLanguage: string;
	export let setUserLanguage: (language: string) => void;

	let sidebarRef: HTMLDivElement;

	let screenSize = { width: 0, height: 0 };
	$: isMobile = screenSize.width <= 768;

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

	function handleClickOutside(event: any) {
		if (isMobile) {
			// Example breakpoint for mobile devices
			if (sidebarIsOpen && sidebarRef && !sidebarRef.contains(event.target)) {
				toggleSidebar(false);
			}
		}
	}
</script>

<div
	class="absolute md:fixed top-0 bottom-0 bg-gray-300 w-64 border-b-2 p-2 z-50 shadow-xl"
	bind:this={sidebarRef}
>
	<div class="flex justify-between">
		<img src="/drill-logo.png" alt="Logo" class="w-6 h-6" />
		<button on:click={() => toggleSidebar(false)}>
			<Icon data={faBars} />
		</button>
	</div>
	<div class="flex flex-col gap-3 mt-6">
		<SideBarItem text="Home" path="/" {toggleSidebar} {isMobile} />
		<SideBarItem text="Subjects" path="/subjects" {toggleSidebar} {isMobile} />
		<SideBarItem text="Create" path="/create-lesson" {toggleSidebar} {isMobile} />
		<SideBarItem text="Media" path="/media" {toggleSidebar} {isMobile} />
		<SideBarItem text="Library" path="/library" {toggleSidebar} {isMobile} />
	</div>

	<div class="absolute bottom-4 left-4 right-4">
		<div class="flex flex-col gap-6">
			<BaseLanguageForm {userLanguage} {setUserLanguage} />
			<ApiKeyForm />
		</div>
	</div>
</div>
