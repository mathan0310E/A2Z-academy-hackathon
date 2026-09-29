export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) {
    return "+91 " + digits.slice(2);
  }
  if (digits.length === 10) {
    return "+91 " + digits;
  }
  return phone;
}

export function formatEmail(name: string, email: string): string {
  return `${name} <${email}>`;
}
