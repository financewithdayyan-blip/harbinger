export type ListType =
  | 'Code Violations'
  | 'Pre-Foreclosure'
  | 'Tax Delinquents'
  | 'Divorce'
  | 'Liens'
  | 'Probate';

export interface Tier {
  name: 'Starter' | 'Pro' | 'Advanced' | 'Extreme';
  description: string;
  skiptraceCredits: number | 'Unlimited';
  listTypes: ListType[];
  features: string[];
  priceId: { month: string; year: string };
}

export const TIERS: Tier[] = [
  {
    name: 'Starter',
    description: 'Essential distressed property leads for new investors.',
    skiptraceCredits: 1500,
    listTypes: ['Code Violations', 'Pre-Foreclosure'],
    features: [
      '1,500 skiptrace credits/month',
      '3 counties',
      'Code Violations leads',
      'Pre-Foreclosure leads',
      'Data hidden until credit is used',
    ],
    priceId: {
      month: 'pri_01ky74awk9xrqrkmjvyt0khjfj',
      year: 'pri_01ky74g1a1d23q2v2v91825qaj',
    },
  },
  {
    name: 'Pro',
    description: 'More lead types, more counties, more deals.',
    skiptraceCredits: 4000,
    listTypes: ['Code Violations', 'Pre-Foreclosure', 'Tax Delinquents', 'Divorce'],
    features: [
      '4,000 skiptrace credits/month',
      '6 counties',
      'Code Violations leads',
      'Pre-Foreclosure leads',
      'Tax Delinquent leads',
      'Divorce leads',
      'Data hidden until credit is used',
    ],
    priceId: {
      month: 'pri_01ky74jrf79z46w3wv8tsqa42p',
      year: 'pri_01ky74m6xed4b48h19anwmhvff',
    },
  },
  {
    name: 'Advanced',
    description: 'Full distressed pipeline across 2 states.',
    skiptraceCredits: 6000,
    listTypes: ['Code Violations', 'Pre-Foreclosure', 'Tax Delinquents', 'Divorce', 'Liens', 'Probate'],
    features: [
      '6,000 skiptrace credits/month',
      '2 states (all counties)',
      'Code Violations leads',
      'Pre-Foreclosure leads',
      'Tax Delinquent leads',
      'Divorce leads',
      'Liens leads',
      'Probate leads',
      'Data hidden until credit is used',
    ],
    priceId: {
      month: 'pri_01ky74rysbh1stzdksgrezwp6p',
      year: 'pri_01ky74t20h9x4kjmgjch2w716d',
    },
  },
  {
    name: 'Extreme',
    description: 'Nationwide access. Every list. No limits on geography.',
    skiptraceCredits: 10000,
    listTypes: ['Code Violations', 'Pre-Foreclosure', 'Tax Delinquents', 'Divorce', 'Liens', 'Probate'],
    features: [
      '10,000 skiptrace credits/month',
      'Nationwide — all states & counties',
      'All list types included',
      'Code Violations, Pre-Foreclosure, Tax Delinquents, Divorce, Liens, Probate',
      'Data hidden until credit is used',
      'Priority support',
    ],
    priceId: {
      month: 'pri_01ky74xhkm8kbn788amz7mjmcr',
      year: 'pri_01ky74zbawqe04v32mm0jxt002',
    },
  },
];
