'use client';

import { useTransition } from 'react';
import { Modal } from 'antd';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';
import { resetData, deleteAccount } from './actions';

export default function AccountDangerActions() {
  const [isPending, startTransition] = useTransition();
  const [modal, contextHolder] = Modal.useModal();

  const handleResetData = () => {
    modal.confirm({
      title: 'Xóa toàn bộ dữ liệu?',
      icon: <AlertTriangle className="w-6 h-6 text-red-500 mb-2 me-2" />,
      content: 'Hành động này sẽ xóa sạch tất cả giao dịch để bắt đầu lại từ đầu. Không thể hoàn tác!',
      okText: 'Xóa dữ liệu',
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
        startTransition(() => {
          resetData();
        });
      },
    });
  };

  const handleDeleteAccount = () => {
    modal.confirm({
      title: 'Xóa tài khoản vĩnh viễn?',
      icon: <Trash2 className="w-6 h-6 text-red-500 mb-2 me-2" />,
      content: 'Hành động này sẽ xóa tài khoản và toàn bộ dữ liệu ra khỏi hệ thống. KHÔNG THỂ hoàn tác!',
      okText: 'Xóa tài khoản',
      cancelText: 'Hủy',
      okButtonProps: { 
        danger: true, 
        className: 'bg-red-600 hover:bg-red-700! border-none h-10! px-6! font-bold rounded-xl!' 
      },
      cancelButtonProps: { 
        className: 'h-10! px-6! font-bold rounded-xl! border-slate-200' 
      },
      centered: true,
      mask: { closable: true },
      onOk: () => {
        startTransition(() => {
          deleteAccount();
        });
      },
    });
  };

  return (
    <div className="space-y-4">
      {contextHolder}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-red-50/50 rounded-xl border border-red-100 gap-4">
        <div>
          <p className="font-semibold text-red-900 text-sm">Xóa toàn bộ dữ liệu</p>
          <p className="text-xs text-red-700/70 mt-1">Xóa sạch tất cả giao dịch để bắt đầu lại từ đầu.</p>
        </div>
        <button 
          onClick={handleResetData}
          disabled={isPending}
          className="bg-white text-red-600 border border-red-200 hover:bg-red-50 h-9 px-4 rounded-lg text-sm font-semibold transition-all shrink-0 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isPending ? "animate-spin" : ""} />
          {isPending ? 'Đang xóa...' : 'Reset dữ liệu'}
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-red-50/50 rounded-xl border border-red-100 gap-4">
        <div>
          <p className="font-semibold text-red-900 text-sm">Xóa tài khoản vĩnh viễn</p>
          <p className="text-xs text-red-700/70 mt-1">Xóa tài khoản và toàn bộ dữ liệu ra khỏi hệ thống.</p>
        </div>
        <button 
          onClick={handleDeleteAccount}
          disabled={isPending}
          className="bg-red-600 text-white hover:bg-red-700 h-9 px-4 rounded-lg text-sm font-semibold transition-all shrink-0 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Trash2 size={14} />
          {isPending ? 'Đang xóa...' : 'Xóa tài khoản'}
        </button>
      </div>
    </div>
  );
}
