import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-2xl">
        404
      </div>
      <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-sm">
        The requested transportation management route or consignment record does not exist.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
      >
        Return to Control Tower
      </Link>
    </div>
  );
}
