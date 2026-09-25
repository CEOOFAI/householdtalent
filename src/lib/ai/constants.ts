export const CV_SKILL_CATEGORIES = {
  service: {
    label: 'Service',
    skills: ['Silver service', 'Formal dining', 'Wine service (WSET)', 'Cocktail preparation'],
  },
  childcare: {
    label: 'Childcare',
    skills: ['Newborn care', 'School-age supervision', 'Child safeguarding', 'Tutoring support'],
  },
  household: {
    label: 'Household',
    skills: ['Laundry & wardrobe care', 'Housekeeping management', 'Inventory management', 'Flower arranging'],
  },
  technical: {
    label: 'Technical',
    skills: ['Smart home systems', 'Security systems', 'Fleet management', 'Pool & garden maintenance'],
  },
  administrative: {
    label: 'Administrative',
    skills: ['Calendar management', 'Travel booking', 'Event planning', 'Household accounting'],
  },
  culinary: {
    label: 'Culinary',
    skills: ['Fine dining', 'Dietary & allergy management', 'Meal planning', 'International cuisine'],
  },
} as const;

export const EXPERIENCE_YEAR_OPTIONS = [
  { value: '<1', label: 'Less than 1 year' },
  { value: '1-2', label: '1-2 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-10', label: '5-10 years' },
  { value: '10+', label: '10+ years' },
] as const;

export const LANGUAGE_PROFICIENCY = [
  { value: 'native', label: 'Native' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'basic', label: 'Basic' },
] as const;

export const SCHEDULE_OPTIONS = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'live_in', label: 'Live-in' },
  { value: 'live_out', label: 'Live-out' },
  { value: 'flexible', label: 'Flexible' },
] as const;

export const START_DATE_OPTIONS = [
  { value: 'asap', label: 'ASAP' },
  { value: '1_month', label: 'Within 1 month' },
  { value: '3_months', label: 'Within 3 months' },
  { value: 'specific', label: 'Specific date' },
] as const;

export const AI_DAILY_LIMIT = 10;
