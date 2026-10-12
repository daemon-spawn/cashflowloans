/**
 * Deterministic Rand formatting. Intl's "en-ZA" output differs between Node and
 * browsers (space vs comma grouping), which breaks React hydration, so we
 * format by hand: R2,000 or R2,000.50.
 */
export function formatRand(amount: number) {
  const fixed = Math.abs(amount).toFixed(2);
  const [whole, cents] = fixed.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${amount < 0 ? "-" : ""}R${grouped}${cents === "00" ? "" : `.${cents}`}`;
}
