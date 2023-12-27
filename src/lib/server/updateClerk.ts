import clerkClient from '@clerk/clerk-sdk-node';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({ request }) => {
	interface UpdateUserRequestBody {
		userId: string;
		params: {
			externalId?: string;
			// ... add more fields as per your requirements
		};
	}

	const requestBody: UpdateUserRequestBody = await request.json();

	if (!requestBody.userId || !requestBody.params) {
		return new Response(JSON.stringify({ error: 'User ID and params are required' }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	try {
		const updatedUser = await clerkClient.users.updateUser(requestBody.userId, requestBody.params);
		return new Response(JSON.stringify(updatedUser), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('Failed to update user:', error);
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
