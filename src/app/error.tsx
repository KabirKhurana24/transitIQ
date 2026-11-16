'use client';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="h-12 w-12 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-lg">
        !
      </div>
      <h3 className="text-lg font-semibold text-slate-900">Module Interruption</h3>
      <p className="text-sm text-slate-500 max-w-md">
        {error?.message || 'We encountered an error loading this transportation module.'}
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
      >
        Reload View
      </button>
    </div>
  );
}
