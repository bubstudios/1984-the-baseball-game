/**
 * Formats a rating value for display.
 * - Whole numbers show no decimal (2, 0)
 * - Decimal values show one decimal place (7.7, 5.3)
 * - Never shows raw JavaScript floating-point precision (7.699999999999999 -> 7.7)
 */
export function formatRating(value) {
  const v = Number(value) || 0;
  const rounded = Math.round(v * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}