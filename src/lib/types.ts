export type Plan = 'single_state' | 'multi_state' | 'nationwide';

export type LeadType = 'pre_foreclosure' | 'code_violations';

export interface UserProfile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  plan: Plan | null;
  lead_type: LeadType | null;
  selected_states: string[];
  onboarding_complete: boolean;
  created_at: string;
}

export interface Lead {
  id: string;
  date_pulled: string;
  case_number: string | null;
  state: string;
  county: string | null;
  list_type: LeadType;
  auction_date: string | null;
  owner_first: string | null;
  owner_last: string | null;
  company_entity: string | null;
  phone_1: string | null;
  phone_2: string | null;
  phone_3: string | null;
  email: string | null;
  email_2: string | null;
  property_street: string | null;
  property_city: string | null;
  property_state: string | null;
  property_zip: string | null;
  mailing_street: string | null;
  mailing_city: string | null;
  mailing_state: string | null;
  mailing_zip: string | null;
  created_at: string;
}

export const LEAD_COLUMNS: { key: keyof Lead; label: string; required?: boolean }[] = [
  { key: 'date_pulled', label: 'Date Pulled' },
  { key: 'case_number', label: 'Case #' },
  { key: 'state', label: 'State', required: true },
  { key: 'county', label: 'County' },
  { key: 'auction_date', label: 'Auction Date' },
  { key: 'owner_first', label: 'Owner First' },
  { key: 'owner_last', label: 'Owner Last' },
  { key: 'company_entity', label: 'Company/Entity' },
  { key: 'phone_1', label: 'Phone' },
  { key: 'phone_2', label: 'Phone 2' },
  { key: 'phone_3', label: 'Phone 3' },
  { key: 'email', label: 'Email' },
  { key: 'email_2', label: 'Email 2' },
  { key: 'property_street', label: 'Property Street', required: true },
  { key: 'property_city', label: 'Property City' },
  { key: 'property_state', label: 'Prop. St' },
  { key: 'property_zip', label: 'Zip' },
  { key: 'mailing_street', label: 'Mailing Street' },
  { key: 'mailing_city', label: 'Mailing City' },
  { key: 'mailing_state', label: 'Mailing St' },
  { key: 'mailing_zip', label: 'Mailing Zip' },
];

export const US_STATES: { code: string; name: string }[] = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }, { code: 'DC', name: 'Washington DC' },
];

export const PLAN_DETAILS: Record<Plan, { title: string; description: string; maxStates: number | 'all' }> = {
  single_state: { title: 'Single State, Single List', description: '1 state, 1 lead type', maxStates: 1 },
  multi_state: { title: 'Multi-State, Single List', description: 'Up to 4 states, 1 lead type', maxStates: 4 },
  nationwide: { title: 'Nationwide, Single List', description: 'All states, 1 lead type', maxStates: 'all' },
};
