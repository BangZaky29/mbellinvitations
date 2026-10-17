import React from 'react';
import { SleekToast } from '../../../components/common/SleekToast';

export interface SaveToastNotificationProps {
  toast: { show: boolean; message: string; isError?: boolean; type?: 'success' | 'info' | 'error' | 'copy' } | null;
  onClose: () => void;
  isInsideMockup?: boolean;
}

export const SaveToastNotification: React.FC<SaveToastNotificationProps> = ({
  toast,
  onClose,
  isInsideMockup = false,
}) => {
  if (!toast || !toast.show) return null;

  const toastType = toast.isError ? 'error' : (toast.type || 'success');

  return (
    <SleekToast
      show={toast.show}
      message={toast.message}
      type={toastType}
      onClose={onClose}
      isInsideMockup={isInsideMockup}
    />
  );
};
