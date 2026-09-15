/**
 * Convert Bangla digits to English digits
 */
export const normalizeBanglaToEnglishDigits = (str: string): string => {
  if (!str) return '';
  const banglaToEnglishMap: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  return str.replace(/[০-৯]/g, (char) => banglaToEnglishMap[char] || char);
};

/**
 * Format English digits to Bangla digits
 */
export const toBanglaDigits = (num: number | string): string => {
  if (num === undefined || num === null) return '';
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit, 10)]);
};

/**
 * Format currency with South Asian number system (Lakh/Crore grouping)
 * e.g., 2000000 -> ৳ ২০,০০,০০০
 */
export const formatTaka = (amount: number, banglaDigits = true): string => {
  if (isNaN(amount) || amount === null) return '৳ ০';

  // Format with standard South Asian comma style (2, 2, 3)
  const amountStr = Math.round(amount).toString();
  let lastThree = amountStr.substring(amountStr.length - 3);
  const otherNumbers = amountStr.substring(0, amountStr.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  return `৳ ${banglaDigits ? toBanglaDigits(formatted) : formatted}`;
};

/**
 * Short human readable Taka for cards (e.g. ৳ ২০ লক্ষ)
 */
export const formatTakaShort = (amount: number): string => {
  if (amount >= 10000000) {
    const crore = (amount / 10000000).toFixed(amount % 10000000 === 0 ? 0 : 2);
    return `৳ ${toBanglaDigits(crore)} কোটি`;
  }
  if (amount >= 100000) {
    const lakh = (amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 2);
    return `৳ ${toBanglaDigits(lakh)} লক্ষ`;
  }
  return formatTaka(amount);
};

/**
 * Format quantity with units in Bangla
 */
export const formatQuantity = (qty: number, unit: string): string => {
  return `${toBanglaDigits(qty)} ${unit}`;
};

/**
 * Format percentage
 */
export const formatPercentage = (val: number): string => {
  return `${toBanglaDigits(val)}%`;
};

/**
 * Format days
 */
export const formatDays = (days: number): string => {
  return `${toBanglaDigits(days)} দিন`;
};

const BANGLA_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

/**
 * Format an ISO date string (YYYY-MM-DD) as a readable Bangla date, e.g. "২০ আগস্ট, ২০২৬"
 */
export const formatBanglaDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return isoDate;
  const day = toBanglaDigits(date.getDate());
  const month = BANGLA_MONTHS[date.getMonth()];
  const year = toBanglaDigits(date.getFullYear());
  return `${day} ${month}, ${year}`;
};
