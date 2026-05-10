'use client';

import { useTransition } from 'react';
import { LogOut } from 'lucide-react';
import { Modal } from 'antd';
import { signOut } from '@/app/auth/actions';

export default function LogoutButton({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const [isPending, startTransition] = useTransition();
  const [modal, contextHolder] = Modal.useModal();

  const handleLogout = () => {
    modal.confirm({
      title: 'Xác nhận đăng xuất?',
      icon: <LogOut className="w-6 h-6 text-red-500 mb-2 me-2" />,
      content: 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình không?',
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      okButtonProps: { 
        danger: true, 
        className: 'bg-red-500 hover:bg-red-600! border-none h-10! px-6! font-bold rounded-xl!' 
      },
      cancelButtonProps: { 
        className: 'h-10! px-6! font-bold rounded-xl! border-slate-200' 
      },
      centered: true,
      mask: { closable: true },
      onOk: () => {
        startTransition(async () => {
          await signOut();
        });
      },
    });
  };

  return (
    <>
      {contextHolder}
      {variant === 'desktop' ? (
        <button 
          onClick={handleLogout}
          disabled={isPending}
          type="button"
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-red-600 border border-red-100 font-medium py-2 px-4 rounded-xl transition-all shadow-sm active:scale-[0.98]"
        >
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </button>
      ) : (
        <button 
          onClick={handleLogout}
          disabled={isPending}
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-100 font-bold py-4 px-6 rounded-xl transition-all shadow-xl shadow-black/2 active:scale-[0.98]"
        >
          <LogOut size={20} />
          <span>Đăng xuất tài khoản</span>
        </button>
      )}
    </>
  );
}
