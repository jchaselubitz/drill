import type { Phrase } from '$src/types/primaryTypes';

export type Option = { title: string; description: string; cards: CardSides[] | undefined };
export type CardSides = { phrase_primary: Phrase; phrase_secondary: Phrase; lesson: string };
