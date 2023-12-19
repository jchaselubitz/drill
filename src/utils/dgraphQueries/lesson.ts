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
				cardDeck {
					id
				}
				subject {
					id
				}
			}
		}
	}
`;

// export const UPDATE_LESSON = graphql`
// 	mutation UpdateLesson($lessonId: ID!, $cardDeck: [AddCardInput!]!) {
// 		updateLesson(input: { id: $lessonId, set: { cardDeck: $cardDeck } }) {
// 			lesson {
// 				id
// 				cardDeck {
// 					id
// 				}
// 			}
// 		}
// 	}
// `;

export const ADD_DECK = graphql`
	mutation AddDeck($cards: [AddCardInput!]!) {
		addCard(input: $cards) {
			card {
				id
				lesson {
					id
				}
			}
		}
	}
`;
