export default function ReportsLoading() {
  return (
    <div className="max-w-none p-4 md:p-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-1 md:pt-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-3 w-32 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-80 bg-slate-100 rounded animate-pulse"></div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="h-10 w-64 bg-slate-100 rounded-xl animate-pulse"></div>
          <div className="hidden sm:block h-10 w-32 bg-slate-100 rounded-xl animate-pulse"></div>
        </div>
      </header>

      {/* Summary Row Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bento-card bg-white border border-slate-100 h-40">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg animate-pulse"></div>
              <div className="h-4 w-24 bg-slate-100 rounded animate-pulse"></div>
            </div>
            <div className="flex items-end justify-between mb-4">
              <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse"></div>
              <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse"></div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="space-y-6">
          <div className="bento-card h-[400px] flex flex-col">
            <div className="mb-8">
              <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-24 bg-slate-100 rounded animate-pulse"></div>
            </div>
            <div className="flex-1 bg-slate-50 rounded-2xl animate-pulse flex items-center justify-center">
              <div className="w-48 h-48 border-8 border-slate-100 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="bento-card h-48 bg-slate-900 border-none animate-pulse"></div>
        </div>

        <div className="space-y-8">
          <div className="bento-card h-[400px] flex flex-col">
            <div className="mb-8">
              <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-24 bg-slate-100 rounded animate-pulse"></div>
            </div>
            <div className="flex-1 bg-slate-50 rounded-2xl animate-pulse flex items-end justify-around p-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-8 bg-slate-200 rounded-t-lg animate-pulse" style={{ height: `${20 + Math.random() * 60}%` }}></div>
              ))}
            </div>
          </div>
          
          <div className="bento-card h-48 border-dashed border-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
