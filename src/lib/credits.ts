/**
 * Credits = skiptrace credits.
 * All lead records are stored with PII hidden behind a shadow layer.
 * A user must spend 1 credit to reveal a record's full contact data.
 * Once monthly credits are exhausted, all data stays hidden and the user
 * sees an upgrade prompt instead of a reveal button.
 *
 * Supabase columns needed on the leads table:
 *   - is_revealed: boolean (default false)
 *   - revealed_by: uuid (references auth.users)
 *   - revealed_at: timestamptz
 *
 * Supabase columns needed on the users/profiles table:
 *   - skiptrace_credits_used: int (default 0)
 *   - skiptrace_credits_limit: int (set from subscription plan)
 *   - credits_reset_at: timestamptz (set to next billing period start)
 */

export function creditsRemaining(used: number, limit: number): number {
  return Math.max(0, limit - used);
}

export function canReveal(used: number, limit: number): boolean {
  return creditsRemaining(used, limit) > 0;
}
