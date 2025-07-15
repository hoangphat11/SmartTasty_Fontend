import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Kết hợp clsx (điều kiện class) và merge class tailwind nếu bị trùng
 * @example
 * cn("bg-red-500", condition && "p-4") // → "bg-red-500 p-4"
 */
export function cn(...inputs: unknown[]) {
  return twMerge(clsx(inputs));
}
