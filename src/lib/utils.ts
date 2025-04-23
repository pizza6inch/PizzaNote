import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化為 yyyy/mm/dd
export const formatDate = (date: string | null): string => {
  const dateObj = date ? new Date(date) : new Date();

  const formattedDate =
    dateObj.getFullYear() +
    "/" +
    (dateObj.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    dateObj.getDate().toString().padStart(2, "0");
  return formattedDate;
};
