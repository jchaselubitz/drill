import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleClerk } from 'clerk-sveltekit/server';

const CLERK_SECRET_KEY = import.meta.env.VITE_CLERK_SECRET_KEY;
export const handle: Handle = sequence(
	handleClerk(CLERK_SECRET_KEY, {
		debug: true,
		protectedPaths: ['/admin'],
		signInUrl: '/sign-in'
	})
);
