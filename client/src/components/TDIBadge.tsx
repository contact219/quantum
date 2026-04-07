export function TDIBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { wrap: "px-3 py-1.5 gap-2", text: "text-xs", sub: "hidden" },
    md: { wrap: "px-4 py-2 gap-3", text: "text-sm", sub: "text-xs" },
    lg: { wrap: "px-5 py-3 gap-3", text: "text-base", sub: "text-sm" },
  };
  const s = sizes[size];

  return (
    <div className={`inline-flex items-center ${s.wrap} rounded-xl border border-emerald-400/30 bg-emerald-400/10`}>
      <span className="text-xl shrink-0">🏛️</span>
      <div>
        <p className={`font-semibold text-emerald-300 ${s.text}`}>
          Licensed · Texas Dept. of Insurance
        </p>
        <p className={`text-emerald-400/70 ${s.sub}`}>
          Agency License #3480229
        </p>
      </div>
    </div>
  );
}
