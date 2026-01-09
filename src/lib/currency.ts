// Currency formatting utility
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return "";
  return `₹${price.toLocaleString("en-IN")}`;
}

export function formatPricePerDay(price: number | null | undefined): string {
  if (price === null || price === undefined) return "";
  return `₹${price.toLocaleString("en-IN")}/day`;
}

export function formatCurrency(price: number | null | undefined): string {
  if (price === null || price === undefined) return "₹0";
  return `₹${price.toLocaleString("en-IN")}`;
}
