import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Lead } from '../lib/types';

const PAGE_SIZE = 50;

export interface LeadsFilters {
  datePulledFrom: string;
  datePulledTo: string;
  auctionDateFrom: string;
  auctionDateTo: string;
  county: string;
}

export const EMPTY_FILTERS: LeadsFilters = {
  datePulledFrom: '',
  datePulledTo: '',
  auctionDateFrom: '',
  auctionDateTo: '',
  county: '',
};

export function useLeads(filters: LeadsFilters, page: number) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    // leads_for_user masks PII (owner name/phone/email) server-side for
    // rows the current user hasn't revealed yet — see schema.sql. Admins
    // use the raw `leads` table directly (CSVUploader/UserTable), which
    // still has full access.
    let query = supabase
      .from('leads_for_user')
      .select('*', { count: 'exact' })
      .order('date_pulled', { ascending: false });

    if (filters.datePulledFrom) query = query.gte('date_pulled', filters.datePulledFrom);
    if (filters.datePulledTo) query = query.lte('date_pulled', filters.datePulledTo);
    if (filters.auctionDateFrom) query = query.gte('auction_date', filters.auctionDateFrom);
    if (filters.auctionDateTo) query = query.lte('auction_date', filters.auctionDateTo);
    if (filters.county.trim()) query = query.ilike('county', `%${filters.county.trim()}%`);

    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);

    const { data, error: queryError, count } = await query;

    if (queryError) {
      setError(queryError.message);
      setLeads([]);
      setTotalCount(0);
    } else {
      setLeads((data as Lead[]) ?? []);
      setTotalCount(count ?? 0);
    }
    setLoading(false);
  }, [filters, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    totalCount,
    pageCount: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    pageSize: PAGE_SIZE,
    loading,
    error,
    refetch: fetchLeads,
  };
}
