const invalidWordErrorMessage =
  "Invalid query parameter: 'word' must be a string of 5 alphabetic characters.";

export function isValidWord(
  word: unknown
): { valid: true; normalizedWord: string } | { valid: false; error: string } {
  if (!word || typeof word !== "string") {
    return { valid: false, error: invalidWordErrorMessage };
  }
  if (!/^[a-zA-Z]{5}$/.test(word)) {
    return { valid: false, error: invalidWordErrorMessage };
  }
  return { valid: true, normalizedWord: word.toLowerCase() };
}
