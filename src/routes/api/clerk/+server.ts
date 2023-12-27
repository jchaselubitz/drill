import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { IncomingHttpHeaders } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { WebhookRequiredHeaders } from 'svix';

import { Webhook } from 'svix';

import type { WebhookEvent } from '@clerk/clerk-sdk-node';
import { getPrimaryEmail } from '$src/utils/helpersClerk';
// import { CREATE_USER, DELETE_USER, GET_USER, UPDATE_USER } from '$lib/graphql/user';
import { graphql } from '$houdini';

const webhookSecret: string = import.meta.env.VITE_WEBHOOK_SECRET || '';

const endpoint = import.meta.env.VITE_DGRAPH_ENDPOINT;
// const getEndpoint = () => {
// 	if (
// 		process.env.VITE_DEPLOY_STAGE === 'production' ||
// 		process.env.VITE_DEPLOY_STAGE === 'staging'
// 	) {
// 		return process.env.VITE_DGRAPH_ENDPOINT;
// 	} else {
// 		return process.env.VITE_DGRAPH_ENDPOINT_UNSECURED;
// 	}
// };

export const POST: RequestHandler = async ({ request }) => {
	const payload = await request.text();
	const headers = Object.fromEntries(request.headers);

	const CREATE_USER = graphql`
		mutation createUserMutation($input: [AddUserInput!]!) {
			addUser(input: $input) {
				user {
					updatedAt
					clerkId
					createdAt
					emailAddress
					image
				}
			}
		}
	`;

	const UPDATE_USER = graphql`
		mutation updateUserMutation($input: UpdateUserInput!) {
			updateUser(input: $input) {
				user {
					updatedAt
					clerkId
					createdAt
					image
					emailAddress
				}
			}
		}
	`;

	const DELETE_USER = graphql`
		mutation deleteUserMutation($id: ID!) {
			deleteUser(filter: { id: [$id] }) {
				msg
				user {
					clerkId
				}
			}
		}
	`;

	const GET_USER = graphql`
		query getUserByClerkId($clerkId: String, $id: ID) {
			getUser(clerkId: $clerkId, id: $id) {
				id
				clerkId
				name
				image
				emailAddress
				subjects {
					id
				}
			}
		}
	`;

	const GET_USER_FROM_EMAIL = graphql`
		query getUserFromEmail($emailAddress: String!) {
			queryUser(filter: { emailAddress: { alloftext: $emailAddress } }) {
				id
				clerkId
				emailAddress
				name
			}
		}
	`;

	// Create a new Webhook instance with your webhook secret
	const wh = new Webhook('whsec_cEzuoKvMGI9HSooLYkLDSRXAR/4y3H9Z');

	let evt: WebhookEvent;
	try {
		evt = wh.verify(payload, headers);
	} catch (error) {
		// Verification failed
		console.log('error', error);
	}
	const { id, email_addresses, primary_email_address_id, image_url, first_name, last_name } =
		evt.data;
	// Process the event based on its type
	switch (evt.type) {
		case 'user.created':
			try {
				await CREATE_USER.mutate({
					input: [
						{
							clerkId: id,
							emailAddress: getPrimaryEmail(email_addresses, primary_email_address_id),
							name: first_name + ' ' + last_name,
							image: image_url,
							updatedAt: new Date().toISOString(),
							createdAt: new Date().toISOString()
							// Add other fields as needed based on your schema
						}
					]
				});
				return new Response(JSON.stringify({ message: 'User created successfully' }), {
					status: 200,
					headers: {
						'Content-Type': 'application/json'
					}
				});
			} catch (error) {
				console.error('Error creating user:', error);
				return new Response(JSON.stringify({ error: 'Failed to create user' }), {
					status: 500,
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}

			break;
		case 'user.updated':
			try {
				const update = await UPDATE_USER.mutate({
					input: {
						filter: { clerkId: { eq: id } },
						set: {
							image: image_url,
							emailAddress: getPrimaryEmail(email_addresses, primary_email_address_id),
							name: first_name + ' ' + last_name,
							updatedAt: new Date().toISOString()
						}
						// Add other fields as needed based on your schema
					}
				});
				return new Response(JSON.stringify({ message: 'User updated successfully' }), {
					status: 200,
					headers: {
						'Content-Type': 'application/json'
					}
				});
			} catch (error) {
				console.error('Error updating user:', error);
				return new Response(JSON.stringify({ error: 'Failed to update user' }), {
					status: 500,
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}

			break;
		case 'user.deleted':
			try {
				const dgraphUser = await GET_USER.query({
					clerkId: id
				});
				const dgraphId = dgraphUser.data.getUser.id;
				await DELETE_USER.mutate({
					id: dgraphId
				});
				return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
					status: 200,
					headers: {
						'Content-Type': 'application/json'
					}
				});
			} catch (error) {
				console.error('Error deleting user:', error);
				return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
					status: 500,
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}

			break;
		default:
			throw Error('400');
	}

	return json({ success: true });
};
