export const Languages = [
	{ name: 'German', value: 'German', code: 'de' },
	{ name: 'English', value: 'English', code: 'en' },
	{ name: 'French', value: 'French', code: 'fr' },
	{ name: 'Spanish', value: 'Spanish', code: 'es' },
	{ name: 'Italian', value: 'Italian', code: 'it' },
	{ name: 'Portuguese', value: 'Portuguese', code: 'pt' },
	{ name: 'Dutch', value: 'Dutch', code: 'nl' },
	{ name: 'Swedish', value: 'Swedish', code: 'sv' },
	{ name: 'Polish', value: 'Polish', code: 'pl' },
	{ name: 'Romanian', value: 'Romanian', code: 'ro' },
	{ name: 'Czech', value: 'Czech', code: 'cs' },
	{ name: 'Danish', value: 'Danish', code: 'da' },
	{ name: 'Hungarian', value: 'Hungarian', code: 'hu' },
	{ name: 'Finnish', value: 'Finnish', code: 'fi' },
	{ name: 'Slovak', value: 'Slovak', code: 'sk' },
	{ name: 'Slovenian', value: 'Slovenian', code: 'sl' },
	{ name: 'Estonian', value: 'Estonian', code: 'et' },
	{ name: 'Greek', value: 'Greek', code: 'el' },
	{ name: 'Bulgarian', value: 'Bulgarian', code: 'bg' },
	{ name: 'Croatian', value: 'Croatian', code: 'hr' },
	{ name: 'Lithuanian', value: 'Lithuanian', code: 'lt' },
	{ name: 'Latvian', value: 'Latvian', code: 'lv' },
	{ name: 'Maltese', value: 'Maltese', code: 'mt' },
	{ name: 'Norwegian', value: 'Norwegian', code: 'no' },
	{ name: 'Turkish', value: 'Turkish', code: 'tr' },
	{ name: 'Ukrainian', value: 'Ukrainian', code: 'uk' },
	{ name: 'Hebrew', value: 'Hebrew', code: 'he' },
	{ name: 'Hindi', value: 'Hindi', code: 'hi' },
	{ name: 'Indonesian', value: 'Indonesian', code: 'id' },
	{ name: 'Korean', value: 'Korean', code: 'ko' },
	{ name: 'Malay', value: 'Malay', code: 'ms' },
	{ name: 'Vietnamese', value: 'Vietnamese', code: 'vi' },
	{ name: 'Chinese', value: 'Chinese', code: 'zh' },
	{ name: 'Japanese', value: 'Japanese', code: 'ja' },
	{ name: 'Urdu', value: 'Urdu', code: 'ur' },
	{ name: 'Bengali', value: 'Beng', code: 'bn' },
	{ name: 'Russian', value: 'Russian', code: 'ru' },
	{ name: 'Arabic', value: 'Arabic', code: 'ar' }
].sort((a, b) => a.name.localeCompare(b.name));

export const Levels = [
	{ name: 'A1', value: 'A1' },
	{ name: 'A2', value: 'A2' },
	{ name: 'B1', value: 'B1' },
	{ name: 'B2', value: 'B2' },
	{ name: 'C1', value: 'C1' },
	{ name: 'C2', value: 'C2' }
];

export const ContentSuggestions = [
	`Computer science and AI`,
	`Adjective verb agreement`,
	`Daily interactions`,
	`Sentences using the word 'Weltschmerz'`
];

export const TranscriptRequestSuggestions = [
	`Extract all of the nouns`,
	`Generate four more paragraphs like this one`,
	`List all the sentences.`
];
