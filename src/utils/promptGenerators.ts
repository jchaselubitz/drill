// ==== Lesson Suggestions ====

import type { gptFormatType } from './generateCards';

export const lessonGenerationSystemInstructions =
	'You will be provided with a request for a list. Return a JSON that is a list of objects, each including the title of the concept and a very short description. Your response will be parsed as follows: JSON.parse(<your-response>)';

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

export const cardGenerationSystemInstructions = ({
	concept,
	keyName,
	valueName
}: {
	concept: string;
	keyName: string;
	valueName: string;
}) =>
	`You will be provided with a request for a list of ${concept} examples. Return a "cards" JSON that is a list of objects, each including key:${keyName} and value:${valueName}. Your response will be parsed as follows: JSON.parse(<your-response>)`;

export const requestCardSuggestions = ({
	concept,
	subject,
	level
}: {
	concept: string;
	subject: string;
	level: string;
}): { prompt: string; format: gptFormatType } => {
	const prompt = `You are creating flashcards for a language student who's level is ${level} (according to the Common European Framework of Reference for Languages). Generate twenty long sentences that demonstrate the concept of ${concept} in ${subject}. `;
	const format = 'json_object';
	return { prompt, format };
};
