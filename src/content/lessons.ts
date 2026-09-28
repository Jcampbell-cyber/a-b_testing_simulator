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
      'On search results, almost everyone ignored it. They were busy looking for the thing they came for, and anything in the way was noise. On the product page, sign-ups rose: visitors were close to their goal and saw a reason to commit. The homepage also performed well, which nobody predicted. When we dug in, most of those sign-ups were returning customers who already trusted the brand. For them, an account was an easy yes.',
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
    summary: 'A scary jump inside a test can barely register across the whole business.',
    paragraphs: [
      'Sometimes a change helps one number and hurts another, and you have to weigh one against the other. Inside an experiment, those shifts can look dramatic.',
      'Say you replace a three-step checkout with a single page. Orders rise 4%, but customer support emails jump 25%, mostly from people unsure whether their order went through. The 25% sounds alarming, and top-line revenue can’t tell you whether it matters, because support costs staff time, not sales.',
      'On a site turning over $100,000 a month from 1,000 orders, 4% more orders is about $4,000 a month. If you get 300 support emails a month, 75 more at about 10 minutes each is roughly $500 of staff time. That’s about $3,500 better off every month, so the change is worth rolling out. And the emails point to the next fix: a clearer confirmation screen keeps the lift and wins back most of that cost.',
      'We weigh every trade-off in real business terms: what is it worth across the whole business? We also check that both shifts are real, not just noise. Often the scary number turns out to be minor. Sometimes it’s the other way round.',
    ],
  },
];
