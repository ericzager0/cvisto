import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  month?: string | number,
  year?: string | number
): string | null {
  if (!month || !year || isNaN(Number(month)) || isNaN(Number(year))) {
    return null;
  }

  const m = Number(month);
  const y = Number(year);

  // Formato ISO (YYYY-MM-DD) compatible con PostgreSQL (usamos día 1 para estandarizar)
  return `${y.toString().padStart(4, "0")}-${m.toString().padStart(2, "0")}-01`;
}

export function cleanString(value: string): string | null {
  const trimmed = value.trim();

  return trimmed === "" ? null : trimmed;
}

export function displayDate(date: string | null): string {
  if (date === null) return "";

  const year = date.slice(0, 4);
  const monthNumber = Number(date.slice(5, 7));
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  return `${months[monthNumber - 1]} ${year}`;
}
