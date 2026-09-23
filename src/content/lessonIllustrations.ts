import { LessonOneIllustration, LessonThreeIllustration, LessonTwoIllustration } from '../components/site/LessonIllustrations';

export const lessonIllustrations: Record<string, () => JSX.Element> = {
  'lesson-1': LessonOneIllustration,
  'lesson-2': LessonTwoIllustration,
  'lesson-3': LessonThreeIllustration,
};
