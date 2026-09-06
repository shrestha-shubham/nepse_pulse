/** Nepalese number/currency formatting helpers. */

const CRORE = 1_00_00_000;
const LAKH = 1_00_000;

/** 1234567 -> "12,34,567" (Indian/Nepali grouping) */
export function groupNepali(value: number, fractionDigits = 0): string {
  const neg = value < 0;
  const fixed = Math.abs(value).toFixed(fractionDigits);
  const [intPart, decPart] = fixed.split(".");
  let out = "";
  if (intPart.length <= 3) {
    out = intPart;
  } else {
    const last3 = intPart.slice(-3);
    const rest = intPart.slice(0, -3);
    out = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3;
  }
  return (neg ? "-" : "") + out + (decPart ? "." + decPart : "");
}

/** Rs. 1,234.50 */
export function formatRs(value: number, fractionDigits = 2): string {
  return `Rs. ${groupNepali(value, fractionDigits)}`;
}

export function formatPrice(value: number): string {
  return groupNepali(value, 2);
}

/** Compact lakh/crore representation: "21.4 Cr", "8.6 L" */
export function formatCompactNpr(value: number): string {
  const abs = Math.abs(value);
  if (abs >= CRORE) return `${(value / CRORE).toFixed(2)} Cr`;
  if (abs >= LAKH) return `${(value / LAKH).toFixed(2)} L`;
  return groupNepali(value, 0);
}

export function formatCompactUnit(value: number): { value: string; unit: string } {
  const abs = Math.abs(value);
  if (abs >= CRORE) return { value: (value / CRORE).toFixed(2), unit: "Cr" };
  if (abs >= LAKH) return { value: (value / LAKH).toFixed(2), unit: "L" };
  return { value: groupNepali(value, 0), unit: "" };
}

export function formatSigned(value: number, fractionDigits = 2): string {
  const s = groupNepali(Math.abs(value), fractionDigits);
  if (value > 0) return `+${s}`;
  if (value < 0) return `-${s}`;
  return s;
}

export function formatPercent(value: number): string {
  return `${formatSigned(value, 2)}%`;
}

export function toneOf(value: number): "up" | "down" | "flat" {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "flat";
}

export const toneTextClass: Record<"up" | "down" | "flat", string> = {
  up: "text-up",
  down: "text-down",
  flat: "text-muted",
};

export function formatDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
}

export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  });
}
