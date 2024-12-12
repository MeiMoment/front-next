import { message } from 'antd';

interface ToastProps {
  title: string;
  variant?: 'default' | 'destructive';
}

export const useToast = () => {
  const toast = ({ title, variant }: ToastProps) => {
    if (variant === 'destructive') {
      message.error(title);
    } else {
      message.success(title);
    }
  };

  return { toast };
}; 