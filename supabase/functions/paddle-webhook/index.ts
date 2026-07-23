// Supabase Edge Function: paddle-webhook
//
// Receives Paddle Billing webhook events and syncs subscription state onto
// user_profiles (tier, skiptrace_credits_limit, credits_reset_at, etc).
// This is the only thing that should ever set those columns — never the
// client, and not even our own frontend after checkout succeeds, since
// Paddle is the source of truth for what someone actually paid for.
//
// Deploy with: supabase functions deploy paddle-webhook --no-verify-jwt
// (--no-verify-jwt because Paddle calls this directly, with no Supabase
// session — signature verification below is what authenticates the request
// instead of a Supabase JWT.)
//
// Requires one secret, set via:
//   supabase secrets set PADDLE_WEBHOOK_SECRET=whsec_...
// (found in Paddle Dashboard -> Developer Tools -> Notifications -> the
// destination pointed at this function's URL)
//
// IMPORTANT: this was written from Paddle's documented webhook payload
// shape, not verified against a live Paddle account (none was available
// while building this). Before going live, send a few test events from
// Paddle's dashboard and confirm the field paths below actually match what
// your account sends — Paddle has changed payload shapes across API
// versions before.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Deliberately duplicated from src/config/tiers.ts rather than imported —
// Supabase's Edge Function bundler only reliably packages files inside this
// function's own directory, so cross-referencing the frontend source is
// fragile across deploys. If tiers.ts changes (new tier, new price IDs,
// credit amounts), update this table too.
const PRICE_TO_TIER: Record<string, { name: string; credits: number }> = {
  pri_01ky74awk9xrqrkmjvyt0khjfj: { name: 'Starter', credits: 1500 },
  pri_01ky74g1a1d23q2v2v91825qaj: { name: 'Starter', credits: 1500 },
  pri_01ky74jrf79z46w3wv8tsqa42p: { name: 'Pro', credits: 4000 },
  pri_01ky74m6xed4b48h19anwmhvff: { name: 'Pro', credits: 4000 },
  pri_01ky74rysbh1stzdksgrezwp6p: { name: 'Advanced', credits: 6000 },
  pri_01ky74t20h9x4kjmgjch2w716d: { name: 'Advanced', credits: 6000 },
  pri_01ky74xhkm8kbn788amz7mjmcr: { name: 'Extreme', credits: 10000 },
  pri_01ky74zbawqe04v32mm0jxt002: { name: 'Extreme', credits: 10000 },
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const WEBHOOK_SECRET = Deno.env.get('PADDLE_WEBHOOK_SECRET')!;

function tierForPriceId(priceId: string): { name: string; credits: number } | null {
  return PRICE_TO_TIER[priceId] ?? null;
}

async function verifySignature(rawBody: string, signatureHeader: string | null): Promise<boolean> {
  if (!signatureHeader) return false;
  const parts = Object.fromEntries(
    signatureHeader.split(';').map((p) => {
      const [k, v] = p.split('=');
      return [k, v];
    })
  );
  const ts = parts.ts;
  const h1 = parts.h1;
  if (!ts || !h1) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(WEBHOOK_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signed = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${ts}:${rawBody}`));
  const computed = Array.from(new Uint8Array(signed))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return computed === h1;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('method not allowed', { status: 405 });
  }

  const rawBody = await req.text();
  const valid = await verifySignature(rawBody, req.headers.get('Paddle-Signature'));
  if (!valid) {
    return new Response('invalid signature', { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const eventType: string = event.event_type;
  const data = event.data ?? {};

  const userId: string | undefined = data.custom_data?.user_id;
  if (!userId) {
    // No way to know whose profile to update — ack anyway so Paddle
    // doesn't keep retrying an event that will never resolve.
    return new Response('ok (no custom_data.user_id)', { status: 200 });
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  if (eventType === 'subscription.created' || eventType === 'subscription.updated') {
    const priceId: string | undefined = data.items?.[0]?.price?.id;
    const tier = priceId ? tierForPriceId(priceId) : null;
    const periodEndsAt: string | undefined = data.current_billing_period?.ends_at;
    const status: string = data.status ?? 'active';

    if (!tier) {
      return new Response(`ok (unrecognized price id: ${priceId})`, { status: 200 });
    }

    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('credits_reset_at')
      .eq('id', userId)
      .maybeSingle();

    // Reset usage only when this looks like a new billing period (or first
    // activation), not on every unrelated "subscription.updated" (payment
    // method changes, etc. also fire this event).
    const isNewPeriod =
      !profile?.credits_reset_at || (periodEndsAt && new Date(periodEndsAt) > new Date(profile.credits_reset_at));

    await supabaseAdmin
      .from('user_profiles')
      .update({
        tier: tier.name,
        skiptrace_credits_limit: tier.credits,
        ...(isNewPeriod ? { skiptrace_credits_used: 0 } : {}),
        credits_reset_at: periodEndsAt ?? null,
        paddle_customer_id: data.customer_id ?? null,
        paddle_subscription_id: data.id ?? null,
        subscription_status: status,
      })
      .eq('id', userId);
  } else if (
    eventType === 'subscription.canceled' ||
    eventType === 'subscription.paused'
  ) {
    await supabaseAdmin
      .from('user_profiles')
      .update({
        tier: null,
        skiptrace_credits_limit: 0,
        subscription_status: eventType === 'subscription.paused' ? 'paused' : 'canceled',
      })
      .eq('id', userId);
  }

  return new Response('ok', { status: 200 });
});
