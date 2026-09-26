// Texas certificate-of-title (bonded title) bond pricing, from RLI's actual charges.
//
// Every priced title bond in our RLI book (bk_bonds, Sep 2026) is 1.5% of the bond amount
// with a $100 minimum: $5,700 -> $100, $8,000 -> $120, $9,075 -> $136, $20,000 -> $300,
// $29,212.50 -> $438. The site previously used flat brackets ($100 up to a $22,500 bond,
// $150 up to $37,500, ...) that under-quoted: the $29,212.50 bond would have shown $150.
//
// Bond amount is 1.5x the vehicle value (TxDMV). Above MAX_AUTO_QUOTE_BOND we have no
// data, so pages say "call for a quote" rather than extrapolate.

export const TITLE_BOND_MIN_PREMIUM = 100;
export const TITLE_BOND_RATE = 0.015;
export const TITLE_BOND_MAX_AUTO_QUOTE = 150000;

export function titleBondAmount(vehicleValue: number): number {
  return Math.ceil(vehicleValue * 1.5);
}

/** Premium in dollars, or null when the bond is too large to quote automatically. */
export function titleBondPremium(bondAmount: number): number | null {
  if (bondAmount > TITLE_BOND_MAX_AUTO_QUOTE) return null;
  return Math.max(TITLE_BOND_MIN_PREMIUM, Math.round(bondAmount * TITLE_BOND_RATE));
}

export function titleBondPremiumLabel(bondAmount: number): string {
  const p = titleBondPremium(bondAmount);
  return p === null ? "Call for quote" : `$${p.toLocaleString("en-US")}`;
}
