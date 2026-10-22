// ============================================================
// USE PAYMENT TRANSACTION HOOK
// Realtime Supabase Listener + Live Countdown Timer
// Untuk dipakai di Step 2 (waiting_payment) Modal Checkout
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { checkTransactionStatus } from '../services/paymentService';
import type { PaymentStatus } from '../types/transaction';

interface UsePaymentTransactionOptions {
  /** Callback saat pembayaran berhasil (settlement) terdeteksi */
  onPaymentSuccess?: () => void;
  /** Callback saat countdown habis (expired) */
  onExpired?: () => void;
}

interface UsePaymentTransactionReturn {
  /** Apakah sedang mendengarkan realtime channel */
  isListening: boolean;
  /** Apakah pembayaran sudah berhasil (settlement) */
  isPaid: boolean;
  /** Apakah countdown sudah habis (expired) */
  isExpired: boolean;
  /** Countdown string terformat (e.g. "14:32" atau "23:45:12") */
  countdown: string;
  /** Sisa detik countdown */
  countdownSeconds: number;
  /** Status pembayaran terakhir yang diketahui */
  currentStatus: PaymentStatus;
  /** Persentase progress (0-100) untuk visual progress bar */
  progressPercent: number;
  /** Mulai mendengarkan realtime + countdown */
  startListening: (orderId: string, expiryTime: string) => void;
  /** Berhenti mendengarkan */
  stopListening: () => void;
  /** Manual refresh status (tombol "Cek Status") */
  refreshStatus: () => Promise<void>;
  /** Apakah sedang loading refresh status */
  isRefreshing: boolean;
}

/**
 * Custom hook untuk mengelola:
 * 1. Supabase Realtime subscription pada tabel public.transactions
 * 2. Live countdown timer menuju expiry_time
 * 3. Auto-detection pembayaran berhasil
 * 4. Manual status check
 */
export function usePaymentTransaction(
  options?: UsePaymentTransactionOptions
): UsePaymentTransactionReturn {
  const [isListening, setIsListening] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<PaymentStatus>('pending');
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refs untuk cleanup dan tracking
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const orderIdRef = useRef<string | null>(null);
  const expiryTimeRef = useRef<Date | null>(null);
  const totalDurationRef = useRef<number>(0);
  const onPaymentSuccessRef = useRef(options?.onPaymentSuccess);
  const onExpiredRef = useRef(options?.onExpired);

  // Keep callback refs fresh
  useEffect(() => {
    onPaymentSuccessRef.current = options?.onPaymentSuccess;
    onExpiredRef.current = options?.onExpired;
  }, [options?.onPaymentSuccess, options?.onExpired]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Stop listening
  const stopListening = useCallback(() => {
    cleanup();
    orderIdRef.current = null;
    expiryTimeRef.current = null;
  }, [cleanup]);

  // Handle payment settlement detected
  const handleSettlement = useCallback(() => {
    setIsPaid(true);
    setCurrentStatus('settlement');
    cleanup();
    onPaymentSuccessRef.current?.();
  }, [cleanup]);

  // Start listening: Subscribe realtime + start countdown
  const startListening = useCallback((orderId: string, expiryTime: string) => {
    // Cleanup previous if any
    cleanup();

    orderIdRef.current = orderId;
    const expiry = new Date(expiryTime);
    expiryTimeRef.current = expiry;

    // Calculate total duration for progress bar
    const now = new Date();
    const totalMs = expiry.getTime() - now.getTime();
    totalDurationRef.current = Math.max(Math.floor(totalMs / 1000), 0);
    setCountdownSeconds(totalDurationRef.current);

    // Reset states
    setIsPaid(false);
    setIsExpired(false);
    setCurrentStatus('pending');
    setIsListening(true);

    // 1. Subscribe ke Supabase Realtime channel
    const channel = supabase
      .channel(`tx-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'transactions',
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          const newStatus = payload.new?.payment_status as PaymentStatus;
          if (newStatus) {
            setCurrentStatus(newStatus);
            if (newStatus === 'settlement') {
              handleSettlement();
            } else if (newStatus === 'expire' || newStatus === 'cancel' || newStatus === 'deny') {
              setIsExpired(true);
              cleanup();
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Realtime subscribed: tx-${orderId}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.warn(`⚠️ Realtime channel error: tx-${orderId}`);
        }
      });

    channelRef.current = channel;

    // 2. Start countdown interval (setiap 1 detik)
    countdownIntervalRef.current = setInterval(() => {
      const nowMs = Date.now();
      const remainingMs = expiry.getTime() - nowMs;

      if (remainingMs <= 0) {
        setCountdownSeconds(0);
        setIsExpired(true);
        cleanup();
        onExpiredRef.current?.();
        return;
      }

      setCountdownSeconds(Math.ceil(remainingMs / 1000));
    }, 1000);
  }, [cleanup, handleSettlement]);

  // Manual refresh status
  const refreshStatus = useCallback(async () => {
    if (!orderIdRef.current) return;
    setIsRefreshing(true);
    try {
      const txRecord = await checkTransactionStatus(orderIdRef.current);
      if (txRecord) {
        setCurrentStatus(txRecord.payment_status);
        if (txRecord.payment_status === 'settlement') {
          handleSettlement();
        } else if (['expire', 'cancel', 'deny'].includes(txRecord.payment_status)) {
          setIsExpired(true);
          cleanup();
        }
      }
    } catch (err) {
      console.error('refreshStatus error:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [handleSettlement, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Format countdown string
  const formatCountdown = (seconds: number): string => {
    if (seconds <= 0) return '00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percent (100% = full time, 0% = expired)
  const progressPercent = totalDurationRef.current > 0
    ? Math.max(0, Math.min(100, (countdownSeconds / totalDurationRef.current) * 100))
    : 0;

  return {
    isListening,
    isPaid,
    isExpired,
    countdown: formatCountdown(countdownSeconds),
    countdownSeconds,
    currentStatus,
    progressPercent,
    startListening,
    stopListening,
    refreshStatus,
    isRefreshing,
  };
}
