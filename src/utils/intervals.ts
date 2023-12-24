import { getDateDay, toJsDateType, toDbDate, isSameDate } from './helpersDate';

export type UserResponse = 'BAD' | 'HARD' | 'GOOD' | 'EASY';

// import { Card } from '$houdini/types';

/*
@Todo: 
- Add a function to calculate the next interval
- Add function for setting lastRepetition
- Figure out how to determine what card to show next
   - Is it the card with nearest datetime
   - Max number to show per day?

Process
- It should pull all cards that are due today or earlier or no nextRepetition
- It should create "ShowList"
    - put cards from yesterday or before at the end of the list.
    - maxes out at MAX_CARDS_PER_DAY
    - if !nextRepetition add to newList
    - newList maxes out at MAX_NEW_CARDS_PER_DAY
    - map over newList and add to ShowList at random index

- It should show the card with the earliest datetime (this may include cards that are in the past)
- It should go through the list and add intervals according to calculateNextInterval
  - Should update card in DB
  - Should update card in ShowList

when the user goes through each item in the show list
- it should save the interval in ms to the db
- it should set a next repetition date in the db (day)
- as long as showList has items, keep showing cards
- remove item from showlist if nextRepetition is after today
- tally of completed cards (+1day interval) today in db


======

createShowList should first check if a list has been created and if the run date is today
if so, return the list
if not take any words from the list that are due yesterday or earlier and add them to the list
if the list is not full, add words that are due today

*/

export function createReviewDeck({
	latestReview,
	cards,
	max_new_cards,
	max_cards
}: {
	latestReview: Review;
	cards: Card[];
	max_new_cards: number;
	max_cards: number;
}): Card[] {
	const maxReviews = max_cards - max_new_cards;
	const now = new Date();
	const nowDay = getDateDay(now);

	if (!cards) return [];

	let newList: Card[] = [];
	let nextReview: Card[] = [];

	const recentReview = !latestReview || latestReview.deck.length === 0 ? [] : latestReview.deck;

	recentReview.map((card: Card) => {
		if (!card.nextRepetition) {
			newList.push(card);
		}
	});

	cards.map((card) => {
		if (!card.nextRepetition && newList.length < max_new_cards) {
			newList.push(card);
		}
		if (!!card.nextRepetition && nextReview.length < maxReviews) {
			const cardDay = getDateDay(toJsDateType(card.nextRepetition));
			// prioritize cards that are due today and missed cards get bumped to the end of the list
			if (cardDay === nowDay) {
				nextReview.push(card);
			}
			if (cardDay < nowDay) {
				nextReview.push(card);
			}
		}
	});

	newList.map((card) => nextReview.splice(Math.floor(Math.random() * nextReview.length), 0, card));
	// console.log({ cards, newList, nextReview });
	return nextReview;
}

export function calculateNextInterval(
	interval: number,
	repetitions: number,
	response: UserResponse
): number {
	const minuteInMs = 1000 * 60;
	const dayInMs = minuteInMs * 60 * 24;

	let nextInterval = minuteInMs;

	const firstView = repetitions === undefined || repetitions === 0;

	switch (response) {
		case 'BAD':
			// If its new, or the person is repeating the card on the same day, repeat it in 1 minute
			// if its not new, repeat it in 10 minutes
			if (firstView) {
				nextInterval = minuteInMs;
			}
			nextInterval = minuteInMs * 10;
			break;
		case 'HARD':
			// if its new, or the person is repeating the card on the same day, repeat it in 10 minutes
			if (firstView) {
				nextInterval = minuteInMs * 5;
			}
			// if the last interview was more than two days ago, repeat it in 1 day
			if (interval > dayInMs * 2) {
				nextInterval = dayInMs;
			}
			// if its not new, interval stays the same
			nextInterval = interval;
			break;
		case 'GOOD':
			// Good response: apply the spaced repetition algorithm
			if (firstView) {
				nextInterval = dayInMs;
			} else {
				nextInterval = interval * 2.5; // The standard multiplier in Anki is 2.5
			}
			break;
		case 'EASY':
			if (firstView || interval < dayInMs * 4) {
				nextInterval = dayInMs * 4;
			} else {
				// Easy response: increase interval more significantly
				nextInterval = interval * 4;
			}
			break;
	}

	// Ensure the interval is not less than the minimum
	return nextInterval;
}

export function setNextRepetition(nextInterval: number, nextRepetition: Date): string {
	const now = new Date();
	const nowDay = getDateDay(now);
	const daysInFuture = Math.floor(nextInterval / (1000 * 60 * 60 * 24));

	//if the nextInterval is less than a day, set next repetition to current time + nextInterval
	if (daysInFuture === 0) {
		return toDbDate(new Date(now.getTime() + nextInterval));
	}
	//if the nextInterval is more than a day, calculate the number of days based on the nextInterval (in ms) and set next repetition to that number of days from now
	return toDbDate(new Date(nowDay.getTime() + daysInFuture * 1000 * 60 * 60 * 24));
}
