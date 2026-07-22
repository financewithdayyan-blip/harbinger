export type Plan = 'single_state' | 'multi_state' | 'nationwide';

export type LeadType = 'pre_foreclosure' | 'code_violations';

export interface UserProfile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  plan: Plan | null;
  lead_type: LeadType | null;
  selected_states: string[];
  selected_counties: string[];
  onboarding_complete: boolean;
  created_at: string;
}

export interface Lead {
  id: string;
  date_pulled: string;
  state: string;
  county: string | null;
  list_type: LeadType;
  lis_pendens_date: string | null;
  auction_date: string | null;
  violation_description: string | null;
  owner_first: string | null;
  owner_last: string | null;
  phone_1: string | null;
  phone_2: string | null;
  phone_3: string | null;
  email: string | null;
  email_2: string | null;
  property_street: string | null;
  property_city: string | null;
  property_state: string | null;
  property_zip: string | null;
  beds: string | null;
  baths: string | null;
  sqft: string | null;
  lot_size: string | null;
  property_type: string | null;
  notes: string | null;
  created_at: string;
}

// Per-row CSV-mappable fields. list_type, state, county, and date_pulled are
// batch-level tags set once for the whole upload (see CSVUploader), not
// mapped per row, so they're intentionally excluded here.
//
// `appliesTo` scopes a field to one list type (e.g. auction data only makes
// sense for pre-foreclosures, violation descriptions only for code
// violations). Fields with no `appliesTo` apply to every list type.
export const LEAD_COLUMNS: { key: keyof Lead; label: string; required?: boolean; appliesTo?: LeadType[] }[] = [
  { key: 'lis_pendens_date', label: 'Lis Pendens Date', appliesTo: ['pre_foreclosure'] },
  { key: 'auction_date', label: 'Auction Date', appliesTo: ['pre_foreclosure'] },
  { key: 'violation_description', label: 'Violation Description', appliesTo: ['code_violations'] },
  { key: 'owner_first', label: 'Owner First' },
  { key: 'owner_last', label: 'Owner Last' },
  { key: 'phone_1', label: 'Phone' },
  { key: 'phone_2', label: 'Phone 2' },
  { key: 'phone_3', label: 'Phone 3' },
  { key: 'email', label: 'Email' },
  { key: 'email_2', label: 'Email 2' },
  { key: 'property_street', label: 'Property Street', required: true },
  { key: 'property_city', label: 'Property City' },
  { key: 'property_state', label: 'Prop. St' },
  { key: 'property_zip', label: 'Zip' },
  { key: 'beds', label: 'Beds' },
  { key: 'baths', label: 'Baths' },
  { key: 'sqft', label: 'Sqft' },
  { key: 'lot_size', label: 'Lot Size' },
  { key: 'property_type', label: 'Property Type' },
  { key: 'notes', label: 'Notes' },
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
