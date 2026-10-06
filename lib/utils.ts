import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeSearchText(value: string) {
  return value.trim().toLowerCase();
}

export function includesValue<T>(values: readonly T[], value: unknown) {
  return values.some((item) => item === value);
}
