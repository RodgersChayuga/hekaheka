// src/lib/utils.ts

// Existing Tailwind utility (already present)
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ New helper for converting a file (image) to base64 string
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string); // returns data:image/...base64 string
    };

    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file); // triggers base64 encoding
  });
}
