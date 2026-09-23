export interface Lesson {
  id: string;
  title: string;
  /** Short teaser used on the homepage */
  summary: string;
  paragraphs: string[];
}

export const lessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Same prompt, three places, three different results',
    summary: 'A sign-up prompt was ignored on one page, worked on another, and surprised everyone on a third.',
    paragraphs: [
      'We tested asking visitors to create an account at three points: the homepage, the search results page, and the product page.',
      'On search results, almost everyone ignored it. They were busy looking for the thing they came for, and anything in the way was noise. On the product page, sign-ups rose: visitors were close to their goal and saw a reason to commit. The homepage also performed well, which nobody predicted and which didn’t fit the neat story we’d built from the other two.',
      'That’s the point. Even experienced teams can’t reliably predict how people will behave. The only way to know is to test.',
    ],
  },
  {
    id: 'lesson-2',
    title: 'The change that looked like a disaster',
    summary: 'Visitors left in droves, until we followed them for a few weeks and saw what really happened.',
    paragraphs: [
      'Making sign-in mandatory caused a sharp jump in visitors leaving immediately. On that number alone, most teams would have scrapped it.',
      'But we followed visitors over the following weeks. Many of those who left came back and signed in. The ones who never returned turned out to be low-value visitors, and completed purchases weren’t affected at all.',
      'The lesson: judge a change on the outcome that matters to the business, over a long enough window, not on the first scary metric.',
    ],
  },
  {
    id: 'lesson-3',
    title: 'When a big percentage is a small deal',
    summary: 'A scary drop inside a test can barely register across the whole business. You have to do the maths.',
    paragraphs: [
      'Most changes help one number and hurt another. Inside an experiment, those shifts can look dramatic. A 20% drop sounds alarming until you see it applies to a small slice of activity.',
      'We weigh every trade-off in real business terms: how much does this change overall revenue or activity across the whole site? Often the scary effect is minor and the gain is worth it. Sometimes it’s the other way round, and you only know if you do the maths.',
    ],
  },
];
