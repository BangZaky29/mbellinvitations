import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  type PaymentOptionItem,
  type PaymentChannelRecord,
  PAYMENT_METHOD_OPTIONS,
} from '../types/transaction';

/**
 * Hook untuk mengelola daftar metode pembayaran secara dinamis (Remote Config + Realtime).
 * - Mengambil channel aktif dari public.payment_channels di Supabase.
 * - Mendengarkan perubahan Realtime (jika Midtrans meng-approve metode baru, UI update seketika).
 * - Fallback aman ke PAYMENT_METHOD_OPTIONS jika offline.
 */
export function usePaymentChannels() {
  const [channels, setChannels] = useState<PaymentOptionItem[]>(PAYMENT_METHOD_OPTIONS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchChannels = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('payment_channels')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.warn('⚠️ Gagal mengambil payment_channels dari Supabase, gunakan default:', error.message);
        setChannels(PAYMENT_METHOD_OPTIONS);
        return;
      }

      if (Array.isArray(data) && data.length > 0) {
        const mappedChannels: PaymentOptionItem[] = (data as PaymentChannelRecord[]).map((row) => ({
          id: row.id,
          name: row.name,
          category: row.category,
          badge: row.badge,
          icon: row.icon,
          description: row.description,
        }));
        setChannels(mappedChannels);
      } else {
        setChannels(PAYMENT_METHOD_OPTIONS);
      }
    } catch (err) {
      console.warn('⚠️ Exception saat mengambil payment_channels:', err);
      setChannels(PAYMENT_METHOD_OPTIONS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChannels();

    // Berlangganan perubahan Realtime pada tabel payment_channels
    const channelSubscription = supabase
      .channel('payment_channels_realtime_sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_channels',
        },
        (payload) => {
          console.log('🔔 [Realtime Sync] payment_channels diperbarui:', payload.eventType);
          fetchChannels();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelSubscription);
    };
  }, [fetchChannels]);

  return {
    channels,
    isLoading,
    refetchChannels: fetchChannels,
  };
}
