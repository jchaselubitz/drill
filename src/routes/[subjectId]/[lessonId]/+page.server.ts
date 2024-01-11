import { getDateDay, isSameDate, toDbDate, toJsDateType } from '$src/utils/helpersDate';
import { createReviewDeck } from '$src/utils/intervals';

export async function load({ locals, params, depends }) {
	const lessonId = params.lessonId;
	const todayDate = getDateDay(new Date());

	// GET LESSON
	const { data: lessons, error: errorLessons } = await locals.supabase
		.from('lessons')
		.select('id, review_deck, review_date, subject_id, title, short_description, cards (*)')
		.eq('id', lessonId); // Filter the query by lessonId

	const lesson = lessons ? lessons[0] : {};
	const reviewDeckDict = lesson.review_deck ?? [];
	const cards = lesson.cards ?? [];

	// if the the latest review date is today, pull in the whole current review deck and match it to the cards
	depends('app:cardUpdate');
	if (!!lesson.review_date && isSameDate(toJsDateType(lesson.review_date), todayDate)) {
		const incomingDeck = reviewDeckDict.map((card) => {
			return card.id;
		});
		// GET REVIEW DECK
		const { data: reviewDeckAll, error: errorDeck } = await locals.supabase
			.from('cards')
			.select('*')
			.in('id', incomingDeck ?? []); // this needs to include just the ids

		return {
			lesson: lesson,
			reviewDeckDict: reviewDeckDict ?? [],
			reviewDeckCards: reviewDeckAll ?? []
		};
	}

	// if the latest review date is not today, create a new review deck, but include the uncompleted cards from the previous deck
	const incomingDeckUncompleted = reviewDeckDict.filter((card) => {
		if (!card.completed) {
			return card.id;
		}
	});

	const { data: reviewDeckUncompleted, error: errorDeck } = await locals.supabase
		.from('cards')
		.select('*')
		.in('id', incomingDeckUncompleted ?? []); // this needs to include just the ids

	const deck = createReviewDeck({
		latestReview: reviewDeckUncompleted,
		cards,
		max_new_cards: 10,
		max_cards: 40
	});

	const newReviewDeckDict = deck.map((card) => {
		return { id: card.id, completed: false };
	});

	const { error: errorDeckUpdate } = await locals.supabase
		.from('lessons')
		.update({ review_deck: newReviewDeckDict, review_date: toDbDate(todayDate) })
		.eq('id', lesson.id);

	if (errorLessons) {
		throw Error(`'Error fetching lessons:',${errorLessons.message}`);
	} else if (errorDeck) {
		throw Error(`'Error fetching deck:',${errorDeck.message}`);
	} else if (errorDeckUpdate) {
		throw Error(`'Error updating deck:',${errorDeckUpdate.message}`);
	}

	return {
		lesson: lesson,
		reviewDeckDict: newReviewDeckDict ?? [],
		reviewDeckCards: deck ?? []
	};
}
