export default function TransactionsLoading() {
  return (
    <div className="max-w-none p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-6 mb-8 pt-6 md:pt-0">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="h-8 w-40 bg-slate-200 rounded-xl animate-pulse" />
            <div className="h-4 w-32 bg-slate-100 rounded-lg animate-pulse" />
          </div>

          <div className="flex-1 flex items-center gap-3 max-w-4xl w-full">
            <div className="h-10 w-full bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-10 w-28 bg-slate-200 rounded-xl animate-pulse shrink-0" />
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="flex flex-wrap items-center gap-3 p-3 bg-white/50 border border-slate-100 rounded-2xl shadow-sm">
          <div className="h-8 w-48 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block" />
          <div className="h-8 w-40 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block" />
          <div className="h-8 w-56 bg-slate-100 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bento-card p-0 overflow-hidden border-none shadow-xl shadow-slate-200/50">
        <div className="hidden sm:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50/50 border-b border-slate-100">
          <div className="col-span-3 h-3 w-16 bg-slate-200 rounded animate-pulse" />
          <div className="col-span-2 h-3 w-16 bg-slate-200 rounded animate-pulse" />
          <div className="col-span-2 h-3 w-20 bg-slate-200 rounded animate-pulse" />
          <div className="col-span-2 h-3 w-16 bg-slate-200 rounded animate-pulse" />
          <div className="col-span-2 h-3 w-16 bg-slate-200 rounded animate-pulse ml-auto" />
        </div>

        <div className="divide-y divide-slate-50">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 items-center px-8 py-5">
              <div className="col-span-12 sm:col-span-3 flex items-center gap-4">
                <div className="w-11 h-11 bg-slate-100 rounded-2xl animate-pulse shrink-0" />
                <div className="h-4 w-32 bg-slate-100 rounded-lg animate-pulse" />
              </div>
              <div className="hidden sm:block col-span-2">
                <div className="h-5 w-20 bg-slate-100 rounded-full animate-pulse" />
              </div>
              <div className="hidden sm:block col-span-2">
                <div className="h-4 w-24 bg-slate-100 rounded-lg animate-pulse" />
              </div>
              <div className="hidden sm:block col-span-2">
                <div className="h-4 w-32 bg-slate-100 rounded-lg animate-pulse" />
              </div>
              <div className="col-span-8 sm:col-span-2 flex justify-end">
                <div className="h-5 w-24 bg-slate-100 rounded-lg animate-pulse" />
              </div>
              <div className="col-span-4 sm:col-span-1 flex justify-end gap-2">
                <div className="h-8 w-8 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-8 w-8 bg-slate-100 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
