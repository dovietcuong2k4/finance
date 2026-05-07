export default function DashboardLoading() {
  return (
    <div className="max-w-none p-4 md:p-8 animate-in fade-in duration-500">
      {/* Premium Header Skeleton */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
            <div className="h-3 w-24 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-48 bg-slate-100 rounded animate-pulse"></div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto mt-4 md:mt-0">
          <div className="hidden lg:block h-10 w-36 bg-slate-100 rounded-xl animate-pulse"></div>
          <div className="h-10 w-48 bg-slate-100 rounded-xl animate-pulse"></div>
          <div className="h-10 w-10 bg-slate-100 rounded-xl animate-pulse shrink-0"></div>
          <div className="h-10 w-28 bg-slate-200 rounded-xl animate-pulse shrink-0"></div>
        </div>
      </header>

      {/* Bento Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-min">
        
        {/* Section Header */}
        <div className="lg:col-span-4 flex items-center justify-between">
          <div>
            <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 w-32 bg-slate-100 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-slate-100 rounded-xl animate-pulse"></div>
        </div>

        {/* KPI Row */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bento-card bg-white border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-slate-100 rounded animate-pulse"></div>
                <div className="h-8 w-28 bg-slate-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="w-12 h-12 bg-slate-50 rounded-2xl animate-pulse"></div>
            </div>
            <div className="h-3 w-24 bg-slate-50 rounded animate-pulse"></div>
          </div>
        ))}

        {/* Main Content Bento Area (Chart) */}
        <div className="lg:col-span-3 lg:row-span-2">
          <div className="bento-card h-full min-h-[400px] flex flex-col">
            <div className="flex justify-between mb-8">
              <div className="space-y-2">
                <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 w-48 bg-slate-100 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex-1 bg-slate-50 rounded-2xl animate-pulse"></div>
          </div>
        </div>
        
        {/* AI Advisor & Goal */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bento-card h-64 bg-slate-50">
            <div className="h-6 w-24 bg-slate-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-4 w-4/6 bg-slate-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="bento-card h-32 bg-slate-50">
             <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-4"></div>
             <div className="h-8 w-16 bg-slate-200 rounded animate-pulse mb-2"></div>
             <div className="h-2 w-full bg-slate-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Transaction Table Skeleton */}
        <div className="lg:col-span-4 mt-2">
          <div className="bento-card">
            <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-3 w-20 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-5 w-24 bg-slate-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
