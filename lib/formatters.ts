export function formatAadhaar(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  return digits.match(/.{1,4}/g)?.join(" ") ?? "";
}

export function getAadhaarDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 12);
}
