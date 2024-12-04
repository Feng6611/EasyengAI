import { showToast, Toast } from "@raycast/api";

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function handleError(error: Error) {
  console.error(error);
  showToast({
    style: Toast.Style.Failure,
    title: "Error",
    message: error.message,
  });
}

export function isValidInput(input: string): boolean {
  return input.trim().length >= 2;
} 