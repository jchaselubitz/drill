import { graphql } from '$houdini';

export const CREATE_USER = graphql`
	mutation CreateUserMutation($input: [AddUserInput!]!) {
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

export const UPDATE_USER = graphql`
	mutation UpdateUserMutation($input: UpdateUserInput!) {
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

export const DELETE_USER = graphql`
	mutation DeleteUserMutation($id: ID!) {
		deleteUser(filter: { id: [$id] }) {
			msg
			user {
				clerkId
			}
		}
	}
`;

export const GET_USER = graphql`
	query GetUserByClerkId($clerkId: String, $id: ID) {
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

export const GET_USER_FROM_EMAIL = graphql`
	query GetUserFromEmail($emailAddress: String!) {
		queryUser(filter: { emailAddress: { alloftext: $emailAddress } }) {
			id
			clerkId
			emailAddress
			name
		}
	}
`;
