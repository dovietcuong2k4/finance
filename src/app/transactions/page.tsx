import { getTransactions } from './actions';
import AddTransactionModal from '@/components/add-transaction-modal';
import TransactionListClient from './transaction-list-client';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    type?: string;
    search?: string;
  }>;
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const type = params.type as 'income' | 'expense' | undefined;
  const search = params.search || '';
  const pageSize = 10;

  const { data, total } = await getTransactions({ page, pageSize, type, search });
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Giao dịch</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý toàn bộ thu chi của bạn · <span className="font-semibold text-foreground">{total}</span> giao dịch
          </p>
        </div>
        <AddTransactionModal />
      </header>

      {/* Client interactive part */}
      <TransactionListClient
        transactions={data}
        total={total}
        totalPages={totalPages}
        currentPage={page}
        currentType={type}
        currentSearch={search}
      />
    </div>
  );
}
