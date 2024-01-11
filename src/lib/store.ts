import { writable } from 'svelte/store';

// Create a writable store with an initial value of `false`
// This indicates that the sidebar is initially closed
export const sidebarOpen = writable(false);
