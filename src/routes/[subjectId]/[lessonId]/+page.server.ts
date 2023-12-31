import { getDateDay, isSameDate, toDbDate, toJsDateType } from "$src/utils/helpersDate";
import { createReviewDeck } from "$src/utils/intervals";

export async function load({locals, params}) {
  const lessonId = params.lessonId;
  const now = new Date();
  const todayDate = getDateDay( new Date());

  // GET LESSON
  const { data: lessons, error: errorLessons } = await locals.supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId); // Filter the query by lessonId

  const lesson = lessons ? lessons[0] : {};

  // GET CARDS
  const { data: cards, error: errorCards } = await locals.supabase.from("cards").select("*").eq("lesson_id", lessonId); // Filter the query by lessonId

  // GET REVIEW DECK
  const { data: reviewDeck, error: errorDeck } = await locals.supabase
    .from('cards')
    .select('*')
    .in('id', lesson.review_deck ?? []);


  if (!!reviewDeck && !!lesson.review_date && isSameDate(toJsDateType(lesson.review_date), todayDate)) {
    return {
      lesson: lesson,
      reviewDeck: reviewDeck ?? [],
    };
  }

  const deck = createReviewDeck({ reviewDeck, cards, max_new_cards: 5, max_cards: 40 });
  const cardRefs = deck.map((card) => ( card.id ));
 
  const { error: errorDeckUpdate } = await locals.supabase
    .from('lessons')
    .update({ review_deck: cardRefs, review_date: toDbDate(todayDate) })
    .eq('id', lesson.id);

  if (errorLessons) {
    throw Error (`'Error fetching lessons:',${ errorLessons.message}`);
  } else if (errorCards) {
    throw Error (`'Error fetching cards:',${ errorCards.message}`);
  } else if (errorDeck) {
    throw Error (`'Error fetching deck:',${ errorDeck.message}`);
  } else if (errorDeckUpdate) {
    throw Error (`'Error updating deck:',${ errorDeckUpdate.message}`);
  }

  return {
    lesson: lesson,
    cards: cards ?? [],
    reviewDeck: deck ?? [],
  };
}
