'use client';

import { useState, useTransition, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Modal, Form, Input, InputNumber, DatePicker, Button, Select, ConfigProvider } from 'antd';
import { createTransaction, updateTransaction } from '@/app/transactions/actions';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';

export interface TransactionData {
  id: string;
  type: 'income' | 'expense';
  title: string;
  category: string;
  amount: number;
  transaction_date: string;
  description?: string;
}

function TypeSelector({ value, onChange }: { value?: string, onChange?: (val: string) => void }) {
  return (
    <div className="flex p-1 bg-slate-100 rounded-xl w-full">
      <button
        type="button"
        onClick={() => onChange?.('income')}
        className={`flex-1 py-3 font-bold rounded-xl transition-all duration-200 ${
          value === 'income' 
            ? 'bg-white text-green-600 shadow-sm' 
            : 'text-slate-500 hover:text-green-600'
        }`}
      >
        Thu nhập
      </button>
      <button
        type="button"
        onClick={() => onChange?.('expense')}
        className={`flex-1 py-3 font-bold rounded-xl transition-all duration-200 ${
          value === 'expense' 
            ? 'bg-white text-red-600 shadow-sm' 
            : 'text-slate-500 hover:text-red-600'
        }`}
      >
        Chi tiêu
      </button>
    </div>
  );
}

const antdTheme = {
  token: {
    colorPrimary: '#6366f1',
    borderRadius: 8,
    fontFamily: 'inherit',
  },
  components: {
    Button: { borderRadius: 8, controlHeightLG: 44, fontWeight: 600 },
    Input: { borderRadius: 8, controlHeightLG: 44 },
    Select: { borderRadius: 8, controlHeightLG: 44 },
    InputNumber: { borderRadius: 8, controlHeightLG: 44 },
    DatePicker: { borderRadius: 8, controlHeightLG: 44 },
    Modal: { borderRadiusLG: 24, paddingContentHorizontalLG: 32, paddingLG: 32 },
  },
};

const categoryOptions = [
  { value: 'salary', label: 'Lương' },
  { value: 'food', label: 'Ăn uống' },
  { value: 'shopping', label: 'Mua sắm' },
  { value: 'transport', label: 'Di chuyển' },
  { value: 'utilities', label: 'Hóa đơn & Tiện ích' },
  { value: 'entertainment', label: 'Giải trí' },
  { value: 'other', label: 'Khác' },
];

const labelClass = "font-bold text-slate-500 uppercase tracking-widest text-[10px]";

/* ──────── Shared Form Content ──────── */
function TransactionFormFields() {
  return (
    <>
      <Form.Item
        name="type"
        label={<span className={labelClass}>Loại giao dịch</span>}
        rules={[{ required: true }]}
      >
        <TypeSelector />
      </Form.Item>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-6">
        <Form.Item
          name="title"
          label={<span className={labelClass}>Tên giao dịch</span>}
          rules={[{ required: true, message: 'Vui lòng nhập tên giao dịch!' }]}
        >
          <Input size="large" placeholder="VD: Lương tháng, Mua sắm..." className="bg-slate-50 border-slate-200 hover:border-aura-indigo focus:border-aura-indigo transition-all" />
        </Form.Item>

        <Form.Item
          name="category"
          label={<span className={labelClass}>Danh mục</span>}
          rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
        >
          <Select 
            size="large" 
            placeholder="Chọn danh mục" 
            className="w-full"
            styles={{ popup: { root: { borderRadius: '8px' } } }}
            classNames={{ popup: { root: 'shadow-2xl' } }}
            options={categoryOptions}
          />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        <Form.Item
          name="amount"
          label={<span className={labelClass}>Số tiền (VNĐ)</span>}
          rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}
        >
          <InputNumber
            size="large"
            className="w-full bg-slate-50 border-slate-200"
            style={{ width: '100%' }}
            min={0}
            controls={false}
            keyboard={false}
            changeOnWheel={false}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value ? value.replace(/,/g, '') as any : ''}
            placeholder="0"
          />
        </Form.Item>

        <Form.Item
          name="transactionDate"
          label={<span className={labelClass}>Thời gian</span>}
          rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
        >
          <DatePicker 
            size="large"
            className="w-full bg-slate-50 border-slate-200" 
            format="DD/MM/YYYY"
            classNames={{ popup: { root: 'rounded-lg shadow-2xl' } }}
          />
        </Form.Item>
      </div>

      <Form.Item
        name="description"
        label={<span className={labelClass}>Mô tả thêm</span>}
      >
        <Input.TextArea 
          rows={3} 
          placeholder="Ghi chú thêm về giao dịch này..." 
          size="large"
          className="bg-slate-50 border-slate-200 hover:border-aura-indigo focus:border-aura-indigo transition-all rounded-xl"
        />
      </Form.Item>
    </>
  );
}

/* ──────── Add Transaction (with trigger button) ──────── */
export default function AddTransactionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    const formData = new FormData();
    formData.append('type', values.type);
    formData.append('title', values.title);
    formData.append('amount', values.amount.toString());
    formData.append('transactionDate', values.transactionDate.toISOString());
    formData.append('category', values.category);
    if (values.description) formData.append('description', values.description);
    
    startTransition(async () => {
      const result = await createTransaction(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Thêm giao dịch thành công!');
        setIsOpen(false);
        form.resetFields();
      }
    });
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-primary text-white h-11 px-3 sm:px-5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-2 active:scale-95 shrink-0 border-none outline-none cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Thêm mới</span>
      </button>

      <Modal
        title={<span className="text-2xl font-bold tracking-tight text-slate-900">Thêm Giao Dịch Mới</span>}
        open={isOpen}
        onCancel={() => !isPending && setIsOpen(false)}
        footer={null}
        destroyOnHidden
        centered
        width={600}
        className="premium-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ type: 'expense', transactionDate: dayjs() }}
          className="mt-8"
          requiredMark={false}
        >
          <TransactionFormFields />

          <div className="flex justify-end gap-3 mt-10">
            <Button size="large" onClick={() => setIsOpen(false)} disabled={isPending} className="border-none bg-slate-100 text-slate-600 hover:bg-slate-200! transition-all">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" size="large" loading={isPending} className="bg-slate-900 hover:bg-slate-800! shadow-xl shadow-slate-900/10 border-none min-w-[140px]">
              Lưu giao dịch
            </Button>
          </div>
        </Form>
      </Modal>
    </ConfigProvider>
  );
}

/* ──────── Edit Transaction (controlled from outside) ──────── */
export function EditTransactionModal({
  transaction,
  open,
  onClose,
  onSaved,
}: {
  transaction: TransactionData | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [form] = Form.useForm();

  // Populate form when transaction changes
  useEffect(() => {
    if (transaction && open) {
      form.setFieldsValue({
        type: transaction.type,
        title: transaction.title,
        category: transaction.category,
        amount: transaction.amount,
        transactionDate: dayjs(transaction.transaction_date),
        description: transaction.description || '',
      });
    }
  }, [transaction, open, form]);

  const handleFinish = (values: any) => {
    if (!transaction) return;
    startTransition(async () => {
      const result = await updateTransaction(transaction.id, {
        type: values.type,
        title: values.title,
        category: values.category,
        amount: values.amount,
        transaction_date: values.transactionDate.toISOString(),
        description: values.description || null,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Cập nhật giao dịch thành công!');
        onSaved();
      }
    });
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <Modal
        title={<span className="text-2xl font-bold tracking-tight text-slate-900">Chỉnh sửa Giao dịch</span>}
        open={open}
        onCancel={() => !isPending && onClose()}
        footer={null}
        destroyOnHidden
        centered
        width={600}
        className="premium-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="mt-8"
          requiredMark={false}
        >
          <TransactionFormFields />

          <div className="flex justify-end gap-3 mt-10">
            <Button size="large" onClick={onClose} disabled={isPending} className="border-none bg-slate-100 text-slate-600 hover:bg-slate-200! transition-all">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" size="large" loading={isPending} className="bg-slate-900 hover:bg-slate-800! shadow-xl shadow-slate-900/10 border-none min-w-[140px]">
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </Modal>
    </ConfigProvider>
  );
}
