import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { LeadType, Plan } from '../lib/types';

interface SaveProfileParams {
  fullName?: string;
  companyName?: string;
  plan?: Plan;
  leadType?: LeadType;
  selectedStates?: string[];
  selectedCounties?: string[];
  onboardingComplete?: boolean;
}

export function useProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveProfile(params: SaveProfileParams) {
    if (!user) throw new Error('Not authenticated');
    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = { id: user.id };
    if (params.fullName !== undefined) payload.full_name = params.fullName;
    if (params.companyName !== undefined) payload.company_name = params.companyName;
    if (params.plan !== undefined) payload.plan = params.plan;
    if (params.leadType !== undefined) payload.lead_type = params.leadType;
    if (params.selectedStates !== undefined) payload.selected_states = params.selectedStates;
    if (params.selectedCounties !== undefined) payload.selected_counties = params.selectedCounties;
    if (params.onboardingComplete !== undefined) payload.onboarding_complete = params.onboardingComplete;

    const { error: upsertError } = await supabase.from('user_profiles').upsert(payload);

    setSaving(false);
    if (upsertError) {
      setError(upsertError.message);
      throw upsertError;
    }
    await refreshProfile();
  }

  return { profile, saving, error, saveProfile };
}
