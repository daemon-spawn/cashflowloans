/** Validates a 13-digit South African ID number (format, date of birth, Luhn checksum). */
export function isValidSaIdNumber(value: string): boolean {
  if (!/^\d{13}$/.test(value)) return false;

  const month = Number(value.slice(2, 4));
  const day = Number(value.slice(4, 6));
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  let sum = 0;
  for (let i = 0; i < 13; i++) {
    let digit = Number(value[12 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}
