import Link from "next/link";

export function QuickActions() {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/protocol"
        className="group flex items-center justify-between p-5 border border-outline-variant/20 rounded-2xl hover:bg-surface-container-high transition-all"
      >
        <div className="flex items-center gap-4">
          <svg className="w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span className="font-headline font-bold text-sm">Manage Protocol</span>
        </div>
        <svg className="w-5 h-5 text-outline group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      <Link
        href="/results"
        className="group flex items-center justify-between p-5 border border-outline-variant/20 rounded-2xl hover:bg-surface-container-high transition-all"
      >
        <div className="flex items-center gap-4">
          <svg className="w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-headline font-bold text-sm">View Analysis</span>
        </div>
        <svg className="w-5 h-5 text-outline group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
