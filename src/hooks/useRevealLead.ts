import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Lead } from '../lib/types';

export function useRevealLead() {
  const [revealingId, setRevealingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function reveal(leadId: string): Promise<Lead | null> {
    setRevealingId(leadId);
    setError(null);

    const { data, error: invokeError } = await supabase.functions.invoke('reveal-lead', {
      body: { leadId },
    });

    setRevealingId(null);

    if (invokeError) {
      setError(invokeError.message);
      return null;
    }
    return (data?.lead as Lead) ?? null;
  }

  return { reveal, revealingId, error };
}
