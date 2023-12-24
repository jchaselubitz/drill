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
				cards {
					id
				}
				subject {
					id
				}
			}
		}
	}
`;

export const UPDATE_CARD_INTERVAL = graphql`
	mutation UpdateCard(
		$cardId: [ID!]
		$interval: Int!
		$nextRepetition: DateTime!
		$numRepetitions: Int!
	) {
		updateCard(
			input: {
				filter: { id: $cardId }
				set: {
					interval: $interval
					nextRepetition: $nextRepetition
					numRepetitions: $numRepetitions
				}
			}
		) {
			card {
				id
				interval
				nextRepetition
				numRepetitions
				side1
				lesson {
					id
					reviewDate
				}
			}
		}
	}
`;

export const CREATE_REVIEW = graphql`
	mutation CreateReview1($lessonId: [ID!], $reviewDeck: [CardRef], $reviewDate: DateTime!) {
		updateLesson(
			input: {
				filter: { id: $lessonId }
				set: { reviewDeck: $reviewDeck, reviewDate: $reviewDate }
			}
		) {
			lesson {
				id
				reviewDeck {
					nextRepetition
					side1
					side2
					interval
					numRepetitions
					id
				}
				reviewDate
			}
		}
	}
`;

export const REMOVE_CARD_FROM_REVIEW = graphql`
	mutation RemoveCardFromReview($cardId: ID!, $lessonId: [ID!]) {
		updateLesson(input: { filter: { id: $lessonId }, remove: { reviewDeck: { id: $cardId } } }) {
			lesson {
				id
				reviewDeck {
					nextRepetition
					side1
					side2
					interval
					numRepetitions
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
				side1
				lesson {
					id
				}
			}
		}
	}
`;
