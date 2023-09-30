import { graphql } from '$houdini';

export const GET_LESSONS = graphql`
	query GetLessons {
		queryLesson {
			title
			shortDescription
		}
	}
`;

export const ADD_LESSON = graphql`
	mutation AddLesson($title: String!, $description: String!, $subjectId: ID!) {
		addLesson(
			input: { title: $title, shortDescription: $description, subject: { id: $subjectId } }
		) {
			lesson {
				title
				shortDescription
				subject {
					id
				}
			}
		}
	}
`;
