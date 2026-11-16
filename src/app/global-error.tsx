'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md space-y-4">
          <div className="h-14 w-14 mx-auto rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-xl">
            !
          </div>
          <h2 className="text-xl font-bold">System Interruption</h2>
          <p className="text-sm text-slate-400">
            {error?.message || 'An unexpected operational error occurred in TransitIQ TMS.'}
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Retry Operation
          </button>
        </div>
      </body>
    </html>
  );
}
