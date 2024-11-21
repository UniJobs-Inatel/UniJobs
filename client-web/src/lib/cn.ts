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




