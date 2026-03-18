export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function filterName(value: string): string {
  return value.replace(/[^a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣\s]/g, "").slice(0, 10);
}
