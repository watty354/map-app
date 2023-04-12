import { inappropriateWords } from "../const/inappropriateWords";

export const containsInappropriateWords = (text) => {
  const wordsArray = text.toLowerCase().split(" ");
  return wordsArray.some((word) => inappropriateWords.includes(word));
};
