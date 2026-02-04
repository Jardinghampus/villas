import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number as currency (AED)
 */
export function formatCurrency(
  amount: number,
  options?: {
    compact?: boolean;
    decimals?: number;
  }
): string {
  const { compact = false, decimals = 0 } = options ?? {};

  if (compact && amount >= 1_000_000) {
    return `AED ${(amount / 1_000_000).toFixed(1)}M`;
  }

  if (compact && amount >= 1_000) {
    return `AED ${(amount / 1_000).toFixed(0)}K`;
  }

  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-AE").format(num);
}

/**
 * Format square feet
 */
export function formatSqft(sqft: number): string {
  return `${formatNumber(sqft)} sq.ft`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate days ago from date
 */
export function daysAgo(date: string | Date): number {
  const now = new Date();
  const past = new Date(date);
  const diffTime = Math.abs(now.getTime() - past.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const days = daysAgo(date);

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

/**
 * Format date
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-AE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Calculate reading time for text
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Generate slug from title
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate UAE phone number
 */
export function isValidUAEPhone(phone: string): boolean {
  // Accepts formats: +971501234567, 00971501234567, 0501234567, 501234567
  const phoneRegex = /^(\+971|00971|0)?5[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ""));
}

/**
 * Format UAE phone number
 */
export function formatUAEPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(971)?(\d{2})(\d{3})(\d{4})$/);

  if (match) {
    return `+971 ${match[2]} ${match[3]} ${match[4]}`;
  }

  return phone;
}

/**
 * Generate WhatsApp link
 */
export function getWhatsAppLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith("971")
    ? cleanPhone
    : `971${cleanPhone}`;

  const baseUrl = `https://wa.me/${formattedPhone}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
}

/**
 * Delay execution (useful for testing)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get match score color
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

/**
 * Get match score background color
 */
export function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-emerald-100";
  if (score >= 60) return "bg-yellow-100";
  return "bg-red-100";
}

/**
 * Get status color
 */
export function getStatusColor(status: string): {
  bg: string;
  text: string;
  dot: string;
} {
  const colors: Record<string, { bg: string; text: string; dot: string }> = {
    new: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500" },
    qualified: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      dot: "bg-emerald-500",
    },
    matched: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      dot: "bg-purple-500",
    },
    closed: { bg: "bg-gray-100", text: "text-gray-800", dot: "bg-gray-500" },
    inactive: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" },
    available: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      dot: "bg-emerald-500",
    },
    under_offer: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      dot: "bg-yellow-500",
    },
    sold: { bg: "bg-gray-100", text: "text-gray-800", dot: "bg-gray-500" },
    rented: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500" },
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      dot: "bg-yellow-500",
    },
    interested: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      dot: "bg-emerald-500",
    },
    rejected: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" },
  };

  return (
    colors[status] ?? {
      bg: "bg-gray-100",
      text: "text-gray-800",
      dot: "bg-gray-500",
    }
  );
}
