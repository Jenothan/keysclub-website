/**
 * Utility functions for Sri Lankan phone numbers (+94)
 */

export function formatPhoneWithCountryCode(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.trim().replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+94')) {
    return cleaned;
  }
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  if (cleaned.startsWith('94')) {
    return '+' + cleaned;
  }
  return '+94' + cleaned;
}

export function stripCountryCode(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.trim().replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+94')) {
    return cleaned.substring(3);
  }
  if (cleaned.startsWith('94')) {
    return cleaned.substring(2);
  }
  if (cleaned.startsWith('0')) {
    return cleaned.substring(1);
  }
  return cleaned;
}
