import { getTransactions } from './actions';
import TransactionListClient from './transaction-list-client';
import dayjs from 'dayjs';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    type?: string;
    search?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    all?: string;
  }>;
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const type = params.type as 'income' | 'expense' | undefined;
  const search = params.search || '';
  const category = params.category || '';
  
  const showAll = params.all === 'true';
  const startDate = showAll ? '' : (params.startDate || dayjs().subtract(30, 'day').format('YYYY-MM-DD'));
  const endDate = showAll ? '' : (params.endDate || dayjs().format('YYYY-MM-DD'));
  const pageSize = 10;

  const { data, total } = await getTransactions({ 
    page, 
    pageSize, 
    type, 
    search,
    category,
    startDate,
    endDate
  });
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="max-w-none p-4 md:p-8 animate-in fade-in duration-700">
      <TransactionListClient
        transactions={data}
        total={total}
        totalPages={totalPages}
        currentPage={page}
        currentType={type}
        currentSearch={search}
        currentCategory={category}
        currentStartDate={startDate}
        currentEndDate={endDate}
      />
    </div>
  );
}
