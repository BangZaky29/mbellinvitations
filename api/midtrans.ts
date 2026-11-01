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
        let parsed: any = null;
        try {
          parsed = JSON.parse(bodyText);
        } catch {
          parsed = null;
        }

        if (parsed?.order_id && parsed?.transaction_status) {
          console.log(`📩 [Midtrans Webhook] Processing notification for order: ${parsed.order_id}, status: ${parsed.transaction_status}`);

          const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://fsbvnkwxwvffghrdxnxr.supabase.co';
          const supabaseKey =
            process.env.VITE_SUPABASE_ANON_KEY ||
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzYnZua3d4d3ZmZmdocmR4bnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0ODY1NTIsImV4cCI6MjA4NTA2MjU1Mn0.lT6ZSx9ZEwrLu-3olklSCr5cl_lq9xIcimFY8HBSKzg';

          const {
            order_id,
            transaction_status,
            fraud_status,
            settlement_time,
          } = parsed;

          let paymentStatus = 'pending';
          const isPaid =
            transaction_status === 'settlement' ||
            (transaction_status === 'capture' && fraud_status === 'accept');

          if (isPaid) {
            paymentStatus = 'settlement';
          } else if (
            transaction_status === 'cancel' ||
            transaction_status === 'deny' ||
            transaction_status === 'expire'
          ) {
            paymentStatus = transaction_status;
          }

          const nowIso = new Date().toISOString();
          const paidAt = isPaid
            ? settlement_time
              ? new Date(settlement_time.replace(' ', 'T') + '+07:00').toISOString()
              : nowIso
            : null;

          const sbHeaders = {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          };

          try {
            // 1. Update public.transactions
            const txRes = await fetch(
              `${supabaseUrl}/rest/v1/transactions?order_id=eq.${encodeURIComponent(order_id)}`,
              {
                method: 'PATCH',
                headers: sbHeaders,
                body: JSON.stringify({
                  payment_status: paymentStatus,
                  paid_at: paidAt,
                  updated_at: nowIso,
                  midtrans_response: parsed,
                }),
              }
            );

            // 2. Jika lunas, update invitations & user_templates
            if (isPaid && txRes.ok) {
              const txRows = await txRes.json();
              if (Array.isArray(txRows) && txRows.length > 0) {
                const { invitation_id, template_id, user_id } = txRows[0];

                if (invitation_id) {
                  const invGet = await fetch(
                    `${supabaseUrl}/rest/v1/invitations?id=eq.${encodeURIComponent(invitation_id)}&select=unlocked_templates`,
                    { headers: sbHeaders }
                  );
                  let unlockedList: string[] = [];
                  if (invGet.ok) {
                    const invRows = await invGet.json();
                    if (Array.isArray(invRows) && Array.isArray(invRows[0]?.unlocked_templates)) {
                      unlockedList = invRows[0].unlocked_templates;
                    }
                  }
                  const updatedUnlocked = Array.from(new Set([...unlockedList, template_id]));

                  await fetch(
                    `${supabaseUrl}/rest/v1/invitations?id=eq.${encodeURIComponent(invitation_id)}`,
                    {
                      method: 'PATCH',
                      headers: sbHeaders,
                      body: JSON.stringify({
                        status: 'published',
                        is_paid: true,
                        paid_template_id: template_id,
                        unlocked_templates: updatedUnlocked,
                        paid_at: paidAt,
                        updated_at: nowIso,
                      }),
                    }
                  );
                }

                if (user_id) {
                  const utGet = await fetch(
                    `${supabaseUrl}/rest/v1/user_templates?user_id=eq.${encodeURIComponent(user_id)}&order=updated_at.desc&limit=1&select=id,unlocked_templates`,
                    { headers: sbHeaders }
                  );
                  if (utGet.ok) {
                    const utRows = await utGet.json();
                    if (Array.isArray(utRows) && utRows.length > 0) {
                      const utExisting = Array.isArray(utRows[0].unlocked_templates)
                        ? utRows[0].unlocked_templates
                        : [];
                      const utUpdated = Array.from(new Set([...utExisting, template_id]));

                      await fetch(
                        `${supabaseUrl}/rest/v1/user_templates?id=eq.${encodeURIComponent(utRows[0].id)}`,
                        {
                          method: 'PATCH',
                          headers: sbHeaders,
                          body: JSON.stringify({
                            status: 'published',
                            is_paid: true,
                            paid_template_id: template_id,
                            unlocked_templates: utUpdated,
                            paid_at: paidAt,
                            updated_at: nowIso,
                          }),
                        }
                      );
                    }
                  }
                }
              }
            }
          } catch (dbErr) {
            console.error('Supabase webhook update error:', dbErr);
          }

          // Selalu balas HTTP 200 OK ke Midtrans agar tidak mengirim email error
          return new Response(
            JSON.stringify({
              status: 'OK',
              order_id,
              transaction_status,
              message: 'Notification received and processed successfully',
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
