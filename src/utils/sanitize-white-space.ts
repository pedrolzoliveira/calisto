export const sanitizeWhiteSpace = (text: string) => {
  return text.replace(/\s+/g, ' ').trim();
};
