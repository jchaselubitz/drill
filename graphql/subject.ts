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
	mutation AddSubject($name: String!, $currentLevel: String!) {
		addSubject(input: { name: $name, currentLevel: $currentLevel }) {
			subject {
				name
				currentLevel
				id
			}
		}
	}
`);
