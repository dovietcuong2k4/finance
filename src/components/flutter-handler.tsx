'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Modal } from 'antd';

declare global {
  interface Window {
    flutter_inappwebview?: {
      callHandler: (handlerName: string, ...args: any[]) => Promise<any>;
    };
  }
}

export default function FlutterHandler() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleFlutterBack = () => {
      // 1. Check for open modals
      // Ant Design uses .ant-modal-root for its modal containers
      const modalRoot = document.querySelector('.ant-modal-root');
      const isModalOpen = modalRoot && modalRoot.querySelector('.ant-modal:not(.ant-modal-hidden)');
      
      if (isModalOpen) {
        // Try to close static modals (Modal.confirm, Modal.info, etc.)
        Modal.destroyAll();
        // Dispatch custom event for component-based modals
        window.dispatchEvent(new CustomEvent('closeAllModals'));
        return;
      }

      // 2. Routing logic
      const pathSegments = pathname.split('/').filter(Boolean);
      
      // Trang chủ (/), login (/login), signup (/signup)
      const isBasePage = pathSegments.length === 0 || 
                         pathname === '/login' || 
                         pathname === '/signup';

      if (isBasePage) {
        // Gửi sự kiện back tương ứng cho flutter
        if (window.flutter_inappwebview) {
          window.flutter_inappwebview.callHandler('onBackConfirmed');
        } else {
          console.log('Flutter Back Pressed on Base Page (no flutter handler found)');
        }
        return;
      }

      // Router cấp 2+ (e.g., /account/security) -> Về router cấp 1
      if (pathSegments.length >= 2) {
        const parentPath = '/' + pathSegments.slice(0, -1).join('/');
        router.push(parentPath);
      } 
      // Router cấp 1 (e.g., /transactions, /account) -> Về trang chủ
      else {
        router.push('/');
      }
    };

    window.addEventListener('flutterBackButtonPressed', handleFlutterBack);
    return () => window.removeEventListener('flutterBackButtonPressed', handleFlutterBack);
  }, [pathname, router]);

  return null;
}
