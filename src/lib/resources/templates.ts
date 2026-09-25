// Template content for downloadable resources
// Each template is stored as structured data for rendering

export interface TemplateSection {
  heading?: string
  subheading?: string
  content?: string
  list?: string[]
  subsections?: { heading: string; list: string[] }[]
  signature?: boolean
}

export interface Template {
  id: string
  title: string
  sections: TemplateSection[]
  disclaimer: string
}

export const NDA_TEMPLATE: Template = {
  id: 'nda',
  title: 'HOUSEHOLD NON-DISCLOSURE AGREEMENT',
  sections: [
    {
      content: 'This Non-Disclosure Agreement ("Agreement") is entered into between:',
    },
    {
      subheading: 'Employer / Household:',
      content: '[Full Name / Family Name]',
    },
    {
      content: 'and',
    },
    {
      subheading: 'Employee / Recipient:',
      content: '[Full Name]',
    },
    {
      content: 'Date: [Insert Date]',
    },
    {
      heading: 'Purpose',
      content:
        'The Employee acknowledges that in the course of their duties within a private household, they will have access to confidential, sensitive, and personal information.\n\nThis Agreement ensures that such information remains strictly private and protected at all times.',
    },
    {
      heading: 'Definition of Confidential Information',
      content: 'Confidential Information includes, but is not limited to:',
      list: [
        'Personal and family information',
        'Financial matters',
        'Property details and layouts',
        'Security arrangements and systems',
        'Travel plans and schedules',
        'Staff structures and routines',
        'Personal belongings and assets',
        'Any information not publicly available relating to the household',
      ],
    },
    {
      heading: 'Core Confidentiality Obligations',
      content: 'The Employee agrees to:',
      list: [
        'Keep all Confidential Information strictly private',
        'Not disclose information to any third party under any circumstances',
        'Not use information for personal benefit or advantage',
        'Only access information as required for their duties',
      ],
    },
    {
      heading: 'Photography, Recording & Devices',
      content: 'The Employee must not:',
      list: [
        'Take photographs or videos within the property',
        'Record audio of any conversations',
        'Capture images of the household, family members, guests, or belongings',
      ],
      subsections: [
        {
          heading: 'The Employee must not:',
          list: [
            'Share any images, videos, or recordings externally',
            'Store such material on personal devices',
          ],
        },
      ],
    },
    {
      heading: 'Social Media & Public Disclosure',
      content: 'The Employee must not:',
      list: [
        'Post or reference the household, family, or property on social media',
        'Share any details online or in public forums',
        'Discuss the household in any public or semi-public setting',
      ],
      subsections: [
        {
          heading: 'This includes indirect references that could identify the household.',
          list: [],
        },
      ],
    },
    {
      heading: 'Third-Party Disclosure',
      content: 'The Employee must not:',
      list: [
        'Discuss household matters with friends, family, or acquaintances',
        'Share any information with other staff unless required for duties',
        'Disclose information to external contractors or service providers',
      ],
    },
    {
      heading: 'Visitors, Access & Guest Conduct',
      content: 'The Employee must not:',
      list: [
        'Bring unauthorised individuals onto the property',
        'Allow access to the property without prior approval',
        'Share access codes, keys, or security information with any person',
      ],
      subsections: [
        {
          heading:
            'Where visitors, contractors, or third parties are present, the Employee must:',
          list: [
            'Ensure that no photographs, videos, or recordings are taken within the property',
            'Immediately intervene if such activity occurs',
            'Request that any images or recordings are deleted immediately',
          ],
        },
        {
          heading: 'The Employee must also:',
          list: [
            'Report any breach or suspected breach of these requirements to the Employer without delay',
          ],
        },
        {
          heading:
            'The Employee is responsible for ensuring that any visitors or third parties comply with these requirements while on the property.',
          list: [],
        },
      ],
    },
    {
      heading: 'Handling of Information',
      content: 'The Employee agrees to:',
      list: [
        'Keep documents and information secure',
        'Not remove confidential materials from the property unless required',
        'Immediately report any suspected breach of confidentiality',
      ],
    },
    {
      heading: 'Return of Property & Information',
      content: 'Upon request or termination, the Employee must:',
      list: [
        'Return all documents, keys, devices, and materials',
        'Delete any information held on personal devices',
      ],
    },
    {
      heading: 'Duration',
      content: 'These obligations apply:',
      list: ['During employment', 'Indefinitely after employment ends'],
    },
    {
      heading: 'Breach',
      content: 'Any breach of this Agreement may result in:',
      list: [
        'Immediate termination of employment',
        'Potential legal action',
      ],
    },
    {
      heading: 'General',
      content:
        'This Agreement is intended as a template and should be reviewed in accordance with applicable local laws.',
    },
    {
      signature: true,
    },
  ],
  disclaimer:
    'This document is provided as a general template for guidance only and does not constitute legal advice. Users should seek independent legal advice to ensure compliance with applicable laws in their jurisdiction.',
}

export const JOB_DESCRIPTION_TEMPLATE: Template = {
  id: 'job-description',
  title: 'HOUSEHOLD STAFF JOB DESCRIPTION',
  sections: [
    {
      subheading: 'Position Title:',
      content: '[e.g. Housekeeper / Nanny / Butler / House Manager]',
    },
    {
      subheading: 'Reports To:',
      content: '[Employer / Family Name / House Manager]',
    },
    {
      subheading: 'Location:',
      content: '[Property Address / Region]',
    },
    {
      subheading: 'Position Type:',
      content: '[Full-time / Part-time / Live-in / Live-out]',
    },
    {
      subheading: 'Start Date:',
      content: '[Insert Date / ASAP]',
    },
    {
      heading: 'Role Overview',
      content:
        '[Provide a brief summary of the role, the household environment, and the expectations of the position. Include the size of the household, number of staff, and any relevant context about the property or family.]\n\nExample: We are seeking an experienced, discreet [Role] to join a private household in [Location]. The household consists of [number] adults and [number] children, with [number] existing staff members.',
    },
    {
      heading: 'Key Responsibilities',
      list: [
        '[Primary responsibility 1]',
        '[Primary responsibility 2]',
        '[Primary responsibility 3]',
        '[Primary responsibility 4]',
        '[Primary responsibility 5]',
        '[Add or remove as needed]',
      ],
    },
    {
      heading: 'Additional Duties',
      content: 'From time to time, the role may also include:',
      list: [
        '[Occasional duty 1]',
        '[Occasional duty 2]',
        '[Occasional duty 3]',
      ],
    },
    {
      heading: 'Candidate Requirements',
      content: 'Essential:',
      list: [
        'Minimum [X] years experience in a similar private household role',
        'Excellent references from previous household employers',
        'Fluent in [Languages]',
        '[Specific qualification or skill]',
        'Discretion and confidentiality at all times',
      ],
      subsections: [
        {
          heading: 'Desirable:',
          list: [
            '[Additional skill or qualification]',
            '[Additional language]',
            '[Specific experience]',
          ],
        },
      ],
    },
    {
      heading: 'Working Hours & Schedule',
      content:
        '[Detail the expected working hours, days, any flexibility required, overnight duties, travel requirements, etc.]\n\nExample: Monday to Friday, 8:00am to 6:00pm, with flexibility required for occasional weekends and travel with the family.',
    },
    {
      heading: 'Compensation & Benefits',
      list: [
        'Salary: £[Amount] per annum (negotiable based on experience)',
        'Accommodation: [Provided / Not provided]',
        'Annual Leave: [Number] days per year',
        'Other Benefits: [e.g. private health insurance, travel, meals provided]',
      ],
    },
    {
      heading: 'Confidentiality',
      content:
        'This role requires the highest level of discretion. The successful candidate will be required to sign a Non-Disclosure Agreement prior to commencing employment.',
    },
    {
      heading: 'How to Apply',
      content:
        'Please submit your CV and a brief cover letter outlining your relevant experience to [Contact Method].\n\nAll applications are treated in the strictest confidence.',
    },
    {
      signature: true,
    },
  ],
  disclaimer:
    'This document is provided as a general template for guidance only and does not constitute legal advice. Users should seek independent legal advice to ensure documents comply with applicable laws in their jurisdiction.',
}

export const TEMPLATES: Record<string, Template> = {
  nda: NDA_TEMPLATE,
  'job-description': JOB_DESCRIPTION_TEMPLATE,
}
