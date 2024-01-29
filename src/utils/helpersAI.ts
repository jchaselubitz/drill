export type AiMessage = {
	role: string;
	content: string;
};

export enum OpenAiModel {
	'gpt3' = 'gpt-3.5-turbo-1106',
	'gpt4' = 'gpt-4-1106-preview'
}

export const getModelSelection = () => {
	if (typeof window !== 'undefined') {
		const selection = localStorage.getItem('OpenAIModel') ?? 'gpt3';
		return selection === 'gpt4' ? OpenAiModel.gpt4 : OpenAiModel.gpt3;
	}
};
export const getOpenAiKey = () => {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('OpenAIKey') ?? '';
	}
};

export type gptFormatType = 'json_object' | 'text';
export type ModelParamsType = {
	format: gptFormatType;
	presence_penalty?: number;
	frequency_penalty?: number;
	temperature?: number;
	max_tokens?: number;
};

export type AiGenerateProps = {
	modelParams: ModelParamsType;
	messages: AiMessage[];
	dbParams?: any;
	dbCallback?: any;
};

// const AITESTSTRING = `{"concepts":[
//   {
//     "title": "Noun Gender",
//     "description": "Learn the gender (masculine, feminine, or neuter) of German nouns."
//   },
//   {
//     "title": "Verb Conjugation",
//     "description": "Practice conjugating regular and irregular verbs in different tenses."
//   },
//   {
//     "title": "Cases (Nominative, Accusative, Dative, Genitive)",
//     "description": "Understand how to use different cases for nouns, pronouns, and articles."
//   },
//   {
//     "title": "Word Order",
//     "description": "Master the correct word order in German sentences, including main and subordinate clauses."
//   },
//   {
//     "title": "Modal Verbs",
//     "description": "Learn how to use modal verbs like können, müssen, wollen, etc. in different contexts."
//   },
//   {
//     "title": "Relative Clauses",
//     "description": "Practice constructing and using relative clauses to provide additional information."
//   },
//   {
//     "title": "Prepositions",
//     "description": "Familiarize yourself with common prepositions and their usage in different contexts."
//   }
// ]}`;

export const MOCK_ARBITRARY_RESPONSE = `{"samplekey":{"nouns": ["Uhr", "Nachrichten", "Übersicht", "SPD", "FDP", "Treffen", "Berlin", "Spitzenkandidaten", "Europawahl", "Proteste", "Rechtsextremismus", "Vorwürfen", "Mitarbeiter", "UNO-Flüchtlingshilfswerks", "Palästinenser", "Generalsekretär", "Vereinten", "Nationen", "Konsequenzen", "Meldungen"],
"verbs": ["bestimmen", "geplant", "hat", "angekündigt"],
"adjectives": ["getrennten", "wieder", "vielerorts", "guterresch", "Einzelnen"]}}`;
