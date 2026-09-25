import type { GeneratedBrief, GeneratedCV } from '@/types';

export function buildRoleBriefPrompt(input: {
  roleType: string;
  location: string;
  propertyType: string;
  householdSize: string;
  schedule: string;
  duties: string[];
  salaryMin: number;
  salaryMax: number;
  startDate: string;
  languages: string[];
  specialRequirements: string;
}): string {
  return `You are a luxury household staffing consultant writing a professional role specification.

Write a structured role brief for a ${input.roleType} position in ${input.location}.

Details:
- Property: ${input.propertyType}
- Household: ${input.householdSize}
- Schedule: ${input.schedule}
- Key duties: ${input.duties.join(', ')}
- Salary: £${input.salaryMin.toLocaleString()} - £${input.salaryMax.toLocaleString()} per annum
- Start: ${input.startDate}
- Languages: ${input.languages.join(', ')}
${input.specialRequirements ? `- Special requirements: ${input.specialRequirements}` : ''}

Return ONLY valid JSON matching this exact structure (no markdown, no code fences):
{
  "role_overview": "2-3 sentence summary",
  "key_responsibilities": ["responsibility 1", "responsibility 2"],
  "candidate_requirements": ["requirement 1", "requirement 2"],
  "schedule_compensation": "Description of schedule, compensation, and benefits",
  "about_household": "Anonymised household description"
}

Rules:
- Write in third person, luxury staffing tone
- Never use "apply" or "application" - use "express interest" or "request consideration"
- Be specific to the role type
- Keep the household description anonymised
- Salary always shown as "per annum"`;
}

export function buildCVPrompt(input: {
  roles: { role: string; years: string }[];
  skills: { category: string; skills: string[] }[];
  languages: { language: string; proficiency: string }[];
  availability: string;
  locationPreferences: string[];
  salaryMin: number;
  salaryMax: number;
  personalStatement: string;
  achievements: string;
}): string {
  const rolesText = input.roles.map(r => `${r.role} (${r.years})`).join(', ');
  const skillsText = input.skills.map(s => `${s.category}: ${s.skills.join(', ')}`).join('\n');
  const langsText = input.languages.map(l => `${l.language} (${l.proficiency})`).join(', ');

  return `You are a luxury household staffing consultant writing a professional CV for a candidate.

Candidate details:
- Roles: ${rolesText}
- Skills:
${skillsText}
- Languages: ${langsText}
- Availability: ${input.availability}
- Location preferences: ${input.locationPreferences.join(', ')}
- Salary expectation: £${input.salaryMin.toLocaleString()} - £${input.salaryMax.toLocaleString()} per annum
- Personal statement: "${input.personalStatement}"
${input.achievements ? `- Key achievements: "${input.achievements}"` : ''}

Return ONLY valid JSON matching this exact structure (no markdown, no code fences):
{
  "professional_summary": "Polished paragraph about the candidate",
  "skills_competencies": [{"category": "Category Name", "skills": ["skill1", "skill2"]}],
  "professional_experience": [{"role": "Role Title", "years": "X years", "description": "Brief description"}],
  "languages": [{"language": "Language", "proficiency": "Level"}],
  "availability": "Availability description",
  "location_preferences": ["Location 1"],
  "salary_expectation": "£XX,000 - £XX,000 per annum"
}

Rules:
- Write in third person
- Luxury staffing tone - professional, refined
- Weave achievements into summary naturally
- Salary always "per annum"`;
}

export function parseBriefResponse(text: string): GeneratedBrief {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned) as GeneratedBrief;
}

export function parseCVResponse(text: string): GeneratedCV {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned) as GeneratedCV;
}
