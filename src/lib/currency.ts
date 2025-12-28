// Currency formatting utility
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return "";
  return `₹${price.toLocaleString("en-IN")}`;
}

export function formatPricePerDay(price: number | null | undefined): string {
  if (price === null || price === undefined) return "";
  return `₹${price.toLocaleString("en-IN")}/day`;
}
