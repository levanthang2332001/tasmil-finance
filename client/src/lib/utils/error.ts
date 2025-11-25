// Error utilities

export function formatError(
  error: unknown = "Sorry, there was an error processing your message. Please try again."
): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
