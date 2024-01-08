// ==== Lesson Suggestions ====

import type { gptFormatType } from './generateCards';

export const lessonGenerationSystemInstructions =
	'You will be provided with a request for a list. Return a JSON that is a list of objects, each including the title of the concept and a very short description. Your response will be parsed as follows: JSON.parse(<your-response>)';

export const requestLessonSuggestions = ({
	language,
	level
}: {
	language: string | FormDataEntryValue | null;
	level: string | FormDataEntryValue | null;
}): { prompt: string; format: gptFormatType } => {
	const prompt = `I am studying ${language}, and my current skill level is: ${level}. What are the top seven grammatical concepts you think I should drill? `;
	const format = 'json_object';
	return { prompt, format };
};

// ==== Card Content Generation ====

export const cardGenerationSystemInstructions = ({
	concept,
	keyName,
	valueName
}: {
	concept: string | FormDataEntryValue | null;
	keyName: string | FormDataEntryValue | null;
	valueName: string | FormDataEntryValue | null;
}) =>
	`You will be provided with a request for a list of ${concept} examples. Return a "cards" JSON that is a list of objects, each including key:${keyName} and value:${valueName}. Your response will be parsed as follows: JSON.parse(<your-response>)`;

export const requestCardSuggestions = ({
	concept,
	subject
}: {
	concept: string | FormDataEntryValue | null;
	subject: string | FormDataEntryValue | null;
}): { prompt: string; format: gptFormatType } => {
	const prompt = `Please generate twenty sentences that demonstrate the concept of ${concept} in ${subject}. `;
	const format = 'json_object';
	return { prompt, format };
};
