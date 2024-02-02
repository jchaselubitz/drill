export enum LanguagesISO639 {
	'German' = 'de',
	'English' = 'en',
	'French' = 'fr',
	'Spanish' = 'es',
	'Italian' = 'it',
	'Portuguese' = 'pt',
	'Dutch' = 'nl',
	'Swedish' = 'sv',
	'Polish' = 'pl',
	'Romanian' = 'ro',
	'Czech' = 'cs',
	'Danish' = 'da',
	'Hungarian' = 'hu',
	'Finnish' = 'fi',
	'Slovak' = 'sk',
	'Slovenian' = 'sl',
	'Estonian' = 'et',
	'Greek' = 'el',
	'Bulgarian' = 'bg',
	'Croatian' = 'hr',
	'Lithuanian' = 'lt',
	'Latvian' = 'lv',
	'Maltese' = 'mt',
	'Norwegian' = 'no',
	'Turkish' = 'tr',
	'Ukrainian' = 'uk',
	'Hebrew' = 'he',
	'Hindi' = 'hi',
	'Indonesian' = 'id',
	'Korean' = 'ko',
	'Malay' = 'ms',
	'Vietnamese' = 'vi',
	'Chinese' = 'zh',
	'Japanese' = 'ja',
	'Urdu' = 'ur',
	'Bengali' = 'bn',
	'Russian' = 'ru',
	'Arabic' = 'ar'
}

export const Languages = [
	{ name: 'German', value: LanguagesISO639.German },
	{ name: 'English', value: LanguagesISO639.English },
	{ name: 'French', value: LanguagesISO639.French },
	{ name: 'Spanish', value: LanguagesISO639.Spanish },
	{ name: 'Italian', value: LanguagesISO639.Italian },
	{ name: 'Portuguese', value: LanguagesISO639.Portuguese },
	{ name: 'Dutch', value: LanguagesISO639.Dutch },
	{ name: 'Swedish', value: LanguagesISO639.Swedish },
	{ name: 'Polish', value: LanguagesISO639.Polish },
	{ name: 'Romanian', value: LanguagesISO639.Romanian },
	{ name: 'Czech', value: LanguagesISO639.Czech },
	{ name: 'Danish', value: LanguagesISO639.Danish },
	{ name: 'Hungarian', value: LanguagesISO639.Hungarian },
	{ name: 'Finnish', value: LanguagesISO639.Finnish },
	{ name: 'Slovak', value: LanguagesISO639.Slovak },
	{ name: 'Slovenian', value: LanguagesISO639.Slovenian },
	{ name: 'Estonian', value: LanguagesISO639.Estonian },
	{ name: 'Greek', value: LanguagesISO639.Greek },
	{ name: 'Bulgarian', value: LanguagesISO639.Bulgarian },
	{ name: 'Croatian', value: LanguagesISO639.Croatian },
	{ name: 'Lithuanian', value: LanguagesISO639.Lithuanian },
	{ name: 'Latvian', value: LanguagesISO639.Latvian },
	{ name: 'Maltese', value: LanguagesISO639.Maltese },
	{ name: 'Norwegian', value: LanguagesISO639.Norwegian },
	{ name: 'Turkish', value: LanguagesISO639.Turkish },
	{ name: 'Ukrainian', value: LanguagesISO639.Ukrainian },
	{ name: 'Hebrew', value: LanguagesISO639.Hebrew },
	{ name: 'Hindi', value: LanguagesISO639.Hindi },
	{ name: 'Indonesian', value: LanguagesISO639.Indonesian },
	{ name: 'Korean', value: LanguagesISO639.Korean }
].sort((a, b) => a.name.localeCompare(b.name));

export const getLangName = (langCode: string | null) => {
	return Languages.find((lang) => lang.value === langCode)?.name ?? '';
};

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
