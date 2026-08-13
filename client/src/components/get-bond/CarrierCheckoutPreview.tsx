/**
 * A faithful, non-interactive mock of the first screen RLI's checkout actually renders
 * (mybondapp.com, white-labelled to Quantum Surety), verified in a browser on 2026-08-13.
 *
 * Why this exists: that screen loads as a blank white page with a single modal reading
 * "Please complete the captcha" — no product name, no price, no bond amount, no branding
 * above the fold beyond the header strip. A customer who has just been told "complete your
 * purchase" and lands on that reasonably concludes the link is broken or the site is a
 * phishing page, and leaves. Showing them the screen *before* they leave turns a
 * what-is-this moment into a that's-the-one moment.
 *
 * Purely decorative: aria-hidden, pointer-events disabled, no real reCAPTCHA is loaded.
 * If the carrier redesigns that page, this mock must be re-verified or removed — a
 * preview that no longer matches reality is worse than none.
 */
export default function CarrierCheckoutPreview() {
  return (
    <figure className="m-0">
      <div
        aria-hidden="true"
        className="select-none pointer-events-none rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white"
      >
        {/* browser chrome */}
        <div className="flex items-center gap-1.5 bg-gray-100 border-b border-gray-200 px-2.5 py-1.5">
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          <span className="ml-2 flex-1 truncate rounded bg-white border border-gray-200 px-2 py-0.5 text-[9px] text-gray-400">
            mybondapp.com
          </span>
        </div>

        {/* carrier header — white-labelled with our name */}
        <div className="bg-slate-900 px-3 py-2">
          <p className="text-[10px] font-semibold tracking-wide text-white">QUANTUM SURETY LLC</p>
          <p className="text-[8px] text-slate-400">Simplifying Surety</p>
        </div>

        {/* the blank body + captcha modal */}
        <div className="relative bg-white h-44">
          <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center px-4">
            <div className="w-full max-w-[15rem] rounded-md bg-white border border-gray-200 shadow-lg p-3">
              <p className="text-[10px] font-semibold text-gray-800">Please complete the captcha</p>
              <div className="mt-2 flex items-center gap-2 rounded border border-gray-300 bg-gray-50 px-2 py-1.5">
                <span className="w-3.5 h-3.5 rounded-sm border-2 border-gray-400 bg-white shrink-0" />
                <span className="text-[9px] text-gray-700">I'm not a robot</span>
                <span className="ml-auto flex flex-col items-center gap-px shrink-0">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 border-t-blue-400" />
                  <span className="text-[5px] leading-none text-gray-400">reCAPTCHA</span>
                </span>
              </div>
              <p className="mt-2 text-[7px] leading-snug text-gray-500">
                By selecting Agree &amp; Continue below, you certify that you have read and agree to the Terms of Use.
              </p>
              <div className="mt-2 rounded bg-blue-600 px-2 py-1 text-center text-[8px] font-semibold text-white">
                Agree &amp; Continue
              </div>
            </div>
          </div>
        </div>

        {/* carrier footer */}
        <div className="bg-gray-100 border-t border-gray-200 py-1.5 text-center text-[8px] tracking-widest text-gray-500">
          POWERED BY MYBONDAPP
        </div>
      </div>
      <figcaption className="mt-2 text-[11px] text-gray-500 text-center">
        Preview of the screen that loads first. The page behind the box really is empty — that's normal.
      </figcaption>
    </figure>
  );
}
