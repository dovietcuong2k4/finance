export default function AccountLoading() {
  return (
    <div className="flex-1 bg-[#fdfdfe] p-4 lg:p-8 relative flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-aura-violet rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-aura-indigo rounded-full blur-[120px]" />
      </div>

      <div className="max-w-none w-full relative z-10 animate-in fade-in duration-500 pt-6 md:pt-0">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-8 w-48 bg-slate-200 rounded-xl animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-slate-100 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-slate-100 rounded-xl animate-pulse"></div>
        </div>

        {/* Bento Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Profile Card Skeleton */}
          <div className="bento-card p-6 md:p-8 col-span-1 md:col-span-2 bg-white border border-slate-100 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-slate-200 animate-pulse shrink-0"></div>
            <div className="flex-1 w-full text-center sm:text-left pt-2 flex flex-col items-center sm:items-start">
              <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-4"></div>
              <div className="h-8 w-64 bg-slate-100 rounded-lg animate-pulse mb-4"></div>
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-slate-100 rounded animate-pulse"></div>
                <div className="h-6 w-32 bg-slate-100 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Security Card Skeleton */}
          <div className="bento-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse"></div>
                <div className="h-4 w-20 bg-slate-100 rounded animate-pulse"></div>
              </div>
              <div className="h-3 w-32 bg-slate-100 rounded animate-pulse mb-2"></div>
              <div className="h-10 w-full bg-slate-50 rounded-xl animate-pulse"></div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="h-4 w-24 bg-slate-100 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Settings Form Card Skeleton */}
          <div className="bento-card p-6 md:p-8 col-span-1 md:col-span-2 bg-white border border-slate-100">
             <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse"></div>
                <div className="h-4 w-32 bg-slate-100 rounded animate-pulse"></div>
             </div>
             
             <div className="space-y-4">
               <div className="space-y-2">
                 <div className="h-3 w-20 bg-slate-100 rounded animate-pulse ml-1"></div>
                 <div className="h-12 w-full bg-slate-50 rounded-xl animate-pulse"></div>
               </div>
               
               <div className="pt-4 flex justify-end">
                 <div className="h-10 w-36 bg-slate-200 rounded-xl animate-pulse"></div>
               </div>
             </div>
          </div>

          {/* Activity Card Skeleton */}
          <div className="bento-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
             <div>
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse"></div>
                  <div className="h-4 w-24 bg-slate-100 rounded animate-pulse"></div>
               </div>
               <div className="space-y-4">
                 <div>
                   <div className="h-3 w-24 bg-slate-100 rounded animate-pulse mb-2"></div>
                   <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div>
                 </div>
                 <div>
                   <div className="h-3 w-28 bg-slate-100 rounded animate-pulse mb-2"></div>
                   <div className="h-5 w-40 bg-slate-200 rounded animate-pulse"></div>
                 </div>
               </div>
             </div>
          </div>
          
        </div>

        <div className="w-full text-center mt-10 mb-6">
          <div className="h-4 w-48 bg-slate-100 rounded animate-pulse mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
