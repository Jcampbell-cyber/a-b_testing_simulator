import { Calculator, FlaskConical, GraduationCap, type LucideIcon } from 'lucide-react';
import type { SectionId } from './resources';

export const sectionIcons: Record<SectionId, LucideIcon> = {
  calculators: Calculator,
  'best-practices': GraduationCap,
  'advanced-techniques': FlaskConical,
};
