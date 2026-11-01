export const config = {
  runtime: 'edge',
};

declare const process: {
  env: Record<string, string | undefined>;
};

export default async function handler(req: Request) {
  // 1. Tangani CORS preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      },
    });
  }

  try {
    const url = new URL(req.url);
    const rawPath = url.searchParams.get('path') || '';
    const path = rawPath.replace(/^\/+/, '').trim();

    // Ambil preferensi Sandbox atau Production
    const isSandbox =
      process.env.VITE_MIDTRANS_IS_SANDBOX !== 'false' &&
      process.env.MIDTRANS_IS_SANDBOX !== 'false';

    const targetBase = isSandbox
      ? 'https://api.sandbox.midtrans.com'
      : 'https://api.midtrans.com';

    // 2. Jika diakses langsung tanpa subpath (misal: buka di browser /api/midtrans)
    if (!path) {
      // Jika method GET/HEAD: Berikan status health-check 200 OK (bukan 404)
      if (req.method === 'GET' || req.method === 'HEAD') {
        return new Response(
          JSON.stringify({
            status: 'online',
            service: 'mbell Midtrans Edge API Proxy & Webhook',
            domain: 'mbellinvitations.my.id',
            environment: isSandbox ? 'sandbox' : 'production',
            target_base: targetBase,
            message:
              'Midtrans proxy aktif. Endpoint ini digunakan untuk proxy Core API (/v2/charge, /v2/:id/status) dan relay notifikasi webhook.',
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Jika method POST ke /api/midtrans: Cek apakah ini Notifikasi Webhook dari Midtrans
      if (req.method === 'POST') {
        const bodyText = await req.text();
        let isWebhookPayload = false;
        try {
          const parsed = JSON.parse(bodyText);
          if (parsed?.order_id && parsed?.transaction_status) {
            isWebhookPayload = true;
          }
        } catch {
          // not json
        }

        if (isWebhookPayload) {
          console.log('📩 [Midtrans Webhook Relay] Relaying notification to Supabase Edge Function...');
          const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://fsbvnkwxwvffghrdxnxr.supabase.co';
          const webhookTarget = `${supabaseUrl}/functions/v1/midtrans-webhook`;

          const relayRes = await fetch(webhookTarget, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: bodyText,
          });

          const relayData = await relayRes.text();
          return new Response(relayData, {
            status: relayRes.status,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
      }
    }

    // 3. Bersihkan query param 'path' dari target forwarding
    url.searchParams.delete('path');
    const queryString = url.searchParams.toString();
    const targetUrl = `${targetBase}/${path}${queryString ? `?${queryString}` : ''}`;

    // Ambil Server Key dari Environment Variable
    const serverKey =
      process.env.MIDTRANS_SERVER_KEY ||
      process.env.VITE_MIDTRANS_SERVER_KEY ||
      '';

    const clientAuth = req.headers.get('authorization');
    // Prioritaskan auth header yang valid atau buat dari Server Key
    const authHeader = clientAuth || (serverKey ? `Basic ${btoa(`${serverKey}:`)}` : '');

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': req.headers.get('content-type') || 'application/json',
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const init: RequestInit = {
      method: req.method,
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      init.body = await req.text();
    }

    console.log(`📡 [Midtrans Edge Proxy] Forwarding to: ${targetUrl}`);

    const midtransRes = await fetch(targetUrl, init);
    const responseBody = await midtransRes.text();

    return new Response(responseBody, {
      status: midtransRes.status,
      headers: {
        'Content-Type': midtransRes.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      },
    });
  } catch (err: any) {
    console.error('❌ Midtrans Edge Proxy Error:', err);
    return new Response(
      JSON.stringify({
        error: 'Midtrans Proxy Error',
        message: err?.message || String(err),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
