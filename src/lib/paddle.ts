// Thin wrapper around Paddle.js (Paddle Billing v2 overlay checkout).
//
// Requires two env vars (see .env.local.example):
//   VITE_PADDLE_CLIENT_TOKEN — Paddle's "client-side token" (safe to expose,
//     it's public by design — found in Paddle Dashboard -> Developer Tools
//     -> Authentication)
//   VITE_PADDLE_ENV — 'sandbox' while testing, 'production' once live
//
// If VITE_PADDLE_CLIENT_TOKEN isn't set, isPaddleConfigured() returns false
// so the UI can show a "checkout not configured yet" state instead of a
// broken button — this app ships without real Paddle credentials until
// they're added.

declare global {
  interface Window {
    Paddle?: {
      Environment: { set: (env: string) => void };
      Initialize: (opts: { token: string }) => void;
      Checkout: { open: (opts: Record<string, unknown>) => void };
    };
  }
}

let loadPromise: Promise<void> | null = null;

export function isPaddleConfigured(): boolean {
  return Boolean(import.meta.env.VITE_PADDLE_CLIENT_TOKEN);
}

export function loadPaddle(): Promise<void> {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN as string | undefined;
    if (!token) {
      reject(new Error('VITE_PADDLE_CLIENT_TOKEN is not set'));
      return;
    }
    if (window.Paddle) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.onload = () => {
      if (!window.Paddle) {
        reject(new Error('Paddle.js loaded but window.Paddle is missing'));
        return;
      }
      const env = (import.meta.env.VITE_PADDLE_ENV as string) || 'sandbox';
      window.Paddle.Environment.set(env);
      window.Paddle.Initialize({ token });
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Paddle.js'));
    document.head.appendChild(script);
  });

  return loadPromise;
}

export async function openCheckout(priceId: string, userId: string, email?: string) {
  await loadPaddle();
  window.Paddle?.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    customData: { user_id: userId },
    ...(email ? { customer: { email } } : {}),
  });
}
