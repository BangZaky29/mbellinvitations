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
    const path = url.searchParams.get('path') || '';

    // Ambil preferensi Sandbox atau Production
    const isSandbox =
      process.env.VITE_MIDTRANS_IS_SANDBOX !== 'false' &&
      process.env.MIDTRANS_IS_SANDBOX !== 'false';

    const targetBase = isSandbox
      ? 'https://api.sandbox.midtrans.com'
      : 'https://api.midtrans.com';

    // Bersihkan query param 'path' dari target forwarding
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
