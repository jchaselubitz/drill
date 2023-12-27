import axios from 'axios';

export const getPrimaryEmail = (email_addresses: any[], primary_email_address_id: string) => {
	const primaryEmail = email_addresses.find((email: any) => email.id === primary_email_address_id);
	return primaryEmail.email_address;
};

interface UpdateUserResponse {
	id: string;
	externalId: string;
}

interface UpdateUserPayload {
	userId: string;
	params: {
		externalId: string;
	};
}

export const connectIdToClerk = (userDbId: string, clerkId: string) => {
	if (!clerkId) return;
	const payload: UpdateUserPayload = {
		userId: clerkId,
		params: {
			externalId: userDbId
		}
	};
	axios
		.post<UpdateUserResponse>('/api/updateClerk', payload)
		.then((response) => {
			router.reload();
		})
		.catch((error) => {
			console.error('Error:', error);
		});
};
