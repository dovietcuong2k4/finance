'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pendingText?: string;
}

export default function SubmitButton({ 
  children, 
  pendingText = 'Đang xử lý...', 
  className, 
  ...props 
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      disabled={pending || props.disabled}
      type="submit"
      className={`${className} ${pending ? 'opacity-70 cursor-not-allowed' : ''} flex items-center justify-center gap-2`}
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {pending ? pendingText : children}
    </button>
  );
}
