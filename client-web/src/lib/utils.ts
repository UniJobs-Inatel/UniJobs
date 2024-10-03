import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isoFormatter(data?:string) {
  if(!data) return undefined
  const [dia, mes, ano] = data.split("/");

  return `${ano}-${mes}-${dia}`;
}

/**
 * Remove all non-numeric characters from a string
 *
 * @param value string to be formatted
 * @returns string with only numbers
 */
export function onlyNumbers(value: string): string {
  return value.replace(/\D/g, '');
}


