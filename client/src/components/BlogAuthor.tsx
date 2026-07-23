export function BlogAuthor({
  name = "Nice Shotwell-Sparks",
  role = "Founder, Quantum Surety LLC",
  updated,
}: {
  name?: string;
  role?: string;
  updated?: string;
}) {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200 not-prose">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-indigo-700 font-bold text-base">NS</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{name}</p>
          <p className="text-xs text-gray-500">{role} &bull; TDI-Licensed Agency #3480229</p>
          {updated && (
            <p className="text-xs text-gray-400 mt-0.5">Last updated: {updated}</p>
          )}
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500 leading-relaxed">
        Quantum Surety is a TDI-licensed Texas surety bond agency (license #3480229) specializing
        in notary bonds, contractor bonds, and title bonds for all 254 Texas counties.
        Articles are reviewed against current Texas statutes and TDI, TDLR, and Texas SOS guidelines.
      </p>
    </div>
  );
}
