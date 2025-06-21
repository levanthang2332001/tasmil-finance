export const clearResponse = (response: string) => {
  return response
    .replace(/```json\n/g, '')
    .replace(/```/g, '')
    .trim();
};
