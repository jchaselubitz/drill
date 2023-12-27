import type { HandleClientError } from '@sveltejs/kit';
// To use Clerk components:
import { initializeClerkClient } from 'clerk-sveltekit/client';
// Or for headless mode:
// import { initializeClerkClient } from 'clerk-sveltekit/headless'

const Clerk_Key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

initializeClerkClient(Clerk_Key, {
	afterSignInUrl: '/admin/',
	afterSignUpUrl: '/admin/',
	signInUrl: '/sign-in',
	signUpUrl: '/sign-up'
});

export const handleError: HandleClientError = async ({ error, event }) => {
	console.error(error, event);
};
