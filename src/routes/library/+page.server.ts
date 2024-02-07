import type { LanguagesISO639 } from '$src/utils/lists';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals, depends }) => {
	const { data: phrases, error } = await locals.supabase
		.from('phrases')
		.select(
			'id, text, lang, translations_phrase_primary_id_fkey(id, phrase_primary_id, phrase_secondary_id, lessons(*)), translations_phrase_secondary_id_fkey(id, phrase_primary_id, phrase_secondary_id, lessons(*))'
		);
	if (error) {
		console.log('error', error);
	}

	if (!phrases) {
		return {
			phrases: []
		};
	}
	const mentionedLanguages = phrases.map((phrase) => phrase.lang);
	const uniqueLanguages = Array.from(new Set(mentionedLanguages));

	const phrasesWithTranslations = phrases.map((phrase) => {
		const consolidatedTranslations = phrase.translations_phrase_primary_id_fkey.concat(
			phrase.translations_phrase_secondary_id_fkey
		);

		const correspondingTranslations = consolidatedTranslations.map((translation) => {
			const { phrase_primary_id, phrase_secondary_id, ...rest } = translation;

			return {
				...rest,
				correspondingPhraseId:
					phrase_primary_id === phrase.id ? phrase_secondary_id : phrase_primary_id
			};
		});

		const { translations_phrase_primary_id_fkey, translations_phrase_secondary_id_fkey, ...rest } =
			phrase;

		return {
			...rest,
			correspondingTranslations
		};
	});

	depends('app:library');
	return {
		languages: uniqueLanguages as LanguagesISO639[],
		phrases: phrasesWithTranslations
	};
};
