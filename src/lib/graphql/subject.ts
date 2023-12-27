import { graphql } from '$houdini';

// export const GET_SUBJECTS = graphql(`
// 	query GetSubjects @load {
// 		querySubject {
// 			name
// 			currentLevel
// 			id
// 		}
// 	}
// `);

export const ADD_SUBJECT = graphql(`
	mutation AddSubject($name: String!, $currentLevel: String!, $userId: ID!) {
		addSubject(input: { name: $name, currentLevel: $currentLevel, user: { id: $userId } }) {
			subject {
				name
				currentLevel
				id
			}
		}
	}
`);
