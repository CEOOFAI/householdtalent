import type { LocationEnum, LocationRegion } from "@/types";

export const ROLE_CATEGORIES = [
  "Nanny / Childcare",
  "Housekeeper",
  "House Manager",
  "Chef / Cook",
  "Butler",
  "Personal Assistant",
  "Chauffeur",
  "Gardener",
  "Groundskeeper",
  "Estate Manager",
  "Property Manager",
  "Security / Close Protection",
  "Laundry / Wardrobe",
  "Pet Care",
  "Yacht Crew",
  "Elder Care / Companion",
  "Pool / Maintenance",
  "Handyman / General Maintenance",
  "Tutor / Governess",
  "Personal Trainer / Wellness",
  "Events / Hospitality",
] as const;

export const LOCATIONS: { value: LocationEnum; label: string; region: LocationRegion }[] = [
  { value: "gibraltar", label: "Gibraltar", region: "gibraltar" },
  { value: "la_linea", label: "La L\u00ednea de la Concepci\u00f3n", region: "costa_del_sol_west" },
  { value: "san_roque", label: "San Roque", region: "costa_del_sol_west" },
  { value: "sotogrande", label: "Sotogrande", region: "costa_del_sol_west" },
  { value: "estepona", label: "Estepona", region: "costa_del_sol_west" },
  { value: "manilva", label: "Manilva", region: "costa_del_sol_west" },
  { value: "casares", label: "Casares", region: "costa_del_sol_west" },
  { value: "benahavis", label: "Benahav\u00eds", region: "costa_del_sol_west" },
  { value: "marbella", label: "Marbella", region: "costa_del_sol_west" },
  { value: "mijas", label: "Mijas", region: "costa_del_sol_east" },
  { value: "fuengirola", label: "Fuengirola", region: "costa_del_sol_east" },
  { value: "other", label: "Other", region: "costa_del_sol_east" },
];

export const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "Italian",
  "Portuguese",
  "German",
  "Russian",
  "Arabic",
  "Mandarin",
  "Tagalog",
  "Hindi",
  "Polish",
  "Romanian",
  "Other",
] as const;

export const AVAILABILITY_LABELS: Record<string, string> = {
  immediate: "Available Immediately",
  "1_month": "Available in 1 Month",
  "3_months": "Available in 3 Months",
  not_available: "Not Currently Available",
};

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  villa: "Villa",
  apartment: "Apartment",
  estate: "Estate",
  yacht: "Yacht",
  other: "Other",
};

export const CANDIDATE_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  active: "Active",
  suspended: "Suspended",
};

// Role-posting model constants

export const RESPONSIBILITIES = [
  { id: "cleaning", label: "Cleaning & Housekeeping", icon: "Sparkles" },
  { id: "laundry", label: "Laundry & Wardrobe", icon: "Shirt" },
  { id: "cooking", label: "Cooking & Meal Prep", icon: "ChefHat" },
  { id: "driving", label: "Driving", icon: "Car" },
  { id: "management", label: "Household Management", icon: "Building2" },
  { id: "shopping", label: "Shopping & Errands", icon: "ShoppingBag" },
] as const;

export const POSITION_TYPES = [
  { value: "live_in", label: "Live-in" },
  { value: "live_out", label: "Live-out" },
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
] as const;

export const EXPERIENCE_PREFERRED_OPTIONS = [
  { value: "private_household", label: "Private Household" },
  { value: "luxury_hospitality", label: "Luxury Hospitality" },
  { value: "open_to_both", label: "Open to Both" },
] as const;

export const SALARY_RANGES = [
  { value: "15000-20000", label: "£15,000 - £20,000 p.a." },
  { value: "20000-25000", label: "£20,000 - £25,000 p.a." },
  { value: "25000-30000", label: "£25,000 - £30,000 p.a." },
  { value: "30000-40000", label: "£30,000 - £40,000 p.a." },
  { value: "40000-50000", label: "£40,000 - £50,000 p.a." },
  { value: "50000-65000", label: "£50,000 - £65,000 p.a." },
  { value: "65000+", label: "£65,000+ p.a." },
  { value: "negotiable", label: "Negotiable" },
] as const;

export const LISTING_TIER_LABELS: Record<string, string> = {
  standard: "Standard",
  priority: "Ongoing Hiring",
  ultra: "Priority Search",
};

export const ROLE_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  active: "Active",
  closed: "Closed",
  expired: "Expired",
};

// Expanded skills taxonomy for candidate profiles

export const SKILL_CATEGORIES = [
  {
    id: "cleaning",
    label: "Cleaning & Housekeeping",
    icon: "Sparkles",
    skills: [
      "General cleaning",
      "Deep cleaning",
      "Laundry & ironing",
      "Wardrobe management",
      "Garment care (delicates/couture)",
      "Shoe care & polishing",
      "Silver polishing",
      "Bed making (hotel standard)",
      "Turn-down service",
      "Closet organisation",
      "Seasonal wardrobe rotation",
      "Inventory of linens",
      "Flower arranging",
    ],
  },
  {
    id: "household",
    label: "Household Support",
    icon: "Home",
    skills: [
      "Cooking (family style)",
      "Cooking (fine dining)",
      "Cooking (diet-specific)",
      "Meal planning",
      "Table service (formal)",
      "Table service (informal)",
      "Silver service",
      "Wine service",
      "Bar service & cocktails",
      "Event hosting support",
      "Guest preparation",
      "Stock management",
      "Household inventory systems",
      "Supplier coordination",
    ],
  },
  {
    id: "driving",
    label: "Driving & Errands",
    icon: "Car",
    skills: [
      "Driving principals",
      "School runs",
      "Airport transfers",
      "Long-distance driving",
      "Chauffeur service (formal)",
      "Vehicle maintenance",
      "Car valeting",
      "Running errands",
      "Shopping (daily)",
      "Luxury goods sourcing",
      "Own car",
      "Clean driving licence",
    ],
  },
  {
    id: "childcare",
    label: "Childcare",
    icon: "Baby",
    skills: [
      "Childcare (general)",
      "Baby care & newborns",
      "School runs",
      "Homework support",
      "Educational activities",
      "Language tutoring",
      "Proxy parenting",
      "Travel with family",
      "Overnight care",
      "Babysitting",
      "Behavioural development",
      "Special needs experience",
    ],
  },
  {
    id: "care",
    label: "Care & Companionship",
    icon: "Heart",
    skills: [
      "Elderly care",
      "Dementia care",
      "Medical support (basic)",
      "Medication management",
      "Mobility assistance",
      "Live-in care",
      "Companion care",
      "Post-surgery care",
      "Physiotherapy support (basic)",
    ],
  },
  {
    id: "pa",
    label: "PA & House Management",
    icon: "Briefcase",
    skills: [
      "Diary management",
      "Travel planning",
      "Private jet coordination",
      "Property management",
      "Staff management",
      "Contractor management",
      "Budget management",
      "Expense tracking",
      "Event planning",
      "Household setup & relocation",
      "SOP creation",
      "Procurement (luxury goods)",
      "Vendor negotiation",
      "Multi-property oversight",
      "Security coordination",
    ],
  },
  {
    id: "butler",
    label: "Butler & Formal Service",
    icon: "Crown",
    skills: [
      "Formal service",
      "Silver service",
      "Wine pairing",
      "Table styling",
      "Guest reception",
      "Valet duties",
      "Packing & unpacking",
      "Wardrobe assistance",
      "Shoe care",
      "Personal service to principal",
      "Household presentation standards",
    ],
  },
  {
    id: "garden",
    label: "Garden & Outdoor",
    icon: "TreePine",
    skills: [
      "Garden maintenance",
      "Landscaping",
      "Irrigation systems",
      "Tree care",
      "Pool maintenance",
      "Outdoor cleaning",
      "Pest control",
      "Plant sourcing",
      "Kitchen garden & growing produce",
    ],
  },
  {
    id: "handyman",
    label: "Handyman & Maintenance",
    icon: "Wrench",
    skills: [
      "General repairs",
      "Electrical (basic)",
      "Plumbing (basic)",
      "Painting & decorating",
      "Furniture assembly",
      "Preventative maintenance",
      "Property inspections",
      "Smart home systems",
      "Security systems",
    ],
  },
  {
    id: "pets",
    label: "Pet Care",
    icon: "Dog",
    skills: [
      "Dog care",
      "Cat care",
      "Exotic animals",
      "Dog walking",
      "Feeding schedules",
      "Grooming coordination",
      "Vet visits",
      "Pet travel",
    ],
  },
  {
    id: "travel",
    label: "Travel & Flexibility",
    icon: "Plane",
    skills: [
      "Travel with family",
      "International travel ready",
      "Flexible schedule",
      "Live-in available",
      "Live-out preferred",
      "Split residence working",
      "Passport ready",
    ],
  },
  {
    id: "premium",
    label: "Premium & Differentiators",
    icon: "Star",
    skills: [
      "UHNW experience",
      "Yacht experience",
      "Private jet experience",
      "Formal household experience",
      "Hotel background (5-star)",
      "Discreet & confidentiality trained",
      "Long-term roles (3+ years)",
      "References available",
      "Police check available",
      "Driving licence (EU/UK)",
    ],
  },
] as const;

export const LANGUAGE_PROFICIENCY_LEVELS = [
  "Basic",
  "Conversational",
  "Fluent",
  "Native",
] as const;
