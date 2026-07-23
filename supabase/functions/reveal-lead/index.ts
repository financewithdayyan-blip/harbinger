// Supabase Edge Function: reveal-lead
//
// Spends one skiptrace credit to reveal a lead's PII. Credits are checked
// and deducted server-side via the reveal_lead() Postgres function (see
// schema.sql) — the client never decides whether it has enough credits,
// it just gets told yes or no.
//
// Deploy with: supabase functions deploy reveal-lead
// Requires no extra secrets — SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
// are provided automatically to every Edge Function by Supabase.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405);
  }

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: 'missing_authorization' }, 401);

  const jwt = authHeader.replace(/^Bearer\s+/i, '');
  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(jwt);
  if (userError || !userData.user) {
    return json({ error: 'invalid_session' }, 401);
  }

  let leadId: string | undefined;
  try {
    const body = await req.json();
    leadId = body?.leadId;
  } catch {
    return json({ error: 'invalid_json_body' }, 400);
  }
  if (!leadId) return json({ error: 'missing_lead_id' }, 400);

  const { data, error } = await supabaseAdmin.rpc('reveal_lead', {
    p_lead_id: leadId,
    p_user_id: userData.user.id,
  });

  if (error) {
    const message = error.message ?? 'unknown_error';
    const status = message.includes('insufficient_credits')
      ? 402
      : message.includes('lead_not_found')
        ? 404
        : message.includes('no_active_subscription')
          ? 403
          : 500;
    return json({ error: message }, status);
  }

  return json({ lead: data }, 200);
});
