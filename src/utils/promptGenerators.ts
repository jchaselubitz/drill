// ==== Lesson Suggestions ====

import type { Json } from '$src/types/database.types';
import type { gptFormatType } from './generateCards';

export const lessonGenerationSystemInstructions =
	'Return a JSON that is a list of objects, each including the "title" of the concept and a very short "description". Your response will be parsed as follows: JSON.parse(<your-response>)';

export const requestLessonSuggestions = ({
	language,
	level
}: {
	language: string;
	level: string;
}): { prompt: string; format: gptFormatType } => {
	const prompt = `I am studying ${language}, and my current skill level is: ${level} (according to the Common European Framework of Reference for Languages). What are the top seven grammatical concepts you think I should drill? `;
	const format = 'json_object';
	return { prompt, format };
};

// ==== Card Content Generation ====

export const cardGenerationSystemInstructions = ({ key1, key2 }: { key1: string; key2: string }) =>
	`The student will ask you for a list of examples, which will be added to flashcards. The Your response will be parsed as follows: JSON.parse(<your-response>). Return a "cards" JSON that is a list of objects, each with the following keys: ${key1}, ${key2}`;

export const cardResponseChecks = (response: string) => {
	if (response === '') {
		throw Error('No cards generated. Try again.');
	}
	const cardsObject = JSON.parse(response);
	if (!cardsObject.cards) {
		alert('OpenAI returned wrong format. This happens sometimes. Please try again.');
		throw Error('OpenAI returned wrong format (not .cards). Please try again.');
	}
	const cardsArray = JSON.parse(response).cards;
	if (cardsArray.length === 0) {
		throw Error('No cards generated. Try again.');
	}
	if (!cardsArray[0].side_1 || !cardsArray[0].side_2) {
		alert('OpenAI returned wrong format. This happens sometimes. Please try again.');
		throw Error('OpenAI returned wrong format (not side_1/side_2). Please try again.');
	}
	return cardsArray;
};

export const requestCardSuggestions = ({
	concept,
	userLanguage,
	studyLanguage,
	level
}: {
	concept: string;
	studyLanguage: string;
	userLanguage: string;
	level: string;
}): { prompt: string; format: gptFormatType } => {
	if (studyLanguage === '' || concept === '' || level === '' || userLanguage === '') {
		throw new Error('studyLanguage, concept, or level is empty');
	}
	const prompt = `You are helping a student study ${studyLanguage} at a level that matches ${level} (according to the Common European Framework of Reference for Languages). You are creating flashcards, with ${userLanguage} on one side and ${studyLanguage} on the other. Generate twenty long sentences that demonstrate the concept of ${concept} in ${studyLanguage}. `;
	const format = 'json_object';
	return { prompt, format };
};
