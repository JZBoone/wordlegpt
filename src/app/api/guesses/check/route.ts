import { NextResponse } from "next/server";
import { loadAnswers } from "@/api-biz/answers";
import { isValidWord } from "@/lib/word";
import { guesses } from "@/lib/guesses";

/**
 * @swagger
 * /api/guesses/check:
 *   get:
 *     summary: Check if a word is a valid guess and if it was a past answer
 *     description: Checks from the list of valid wordle words and past answers from the Rock Paper Shotgun website if the word is a valid guess and if it was a past answer.
 *     operationId: checkWord
 *     parameters:
 *       - in: query
 *         name: word
 *         schema:
 *           type: string
 *         required: true
 *         description: The word to check
 *     responses:
 *       200:
 *         description: Indicates if the word is a valid guess and if it was a past answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isPastAnswer:
 *                   type: boolean
 *                   description: Indicates if the word was a past answer
 *                 isValidGuess:
 *                   type: boolean
 *                   description: Indicates if the word is a valid guess
 *       400:
 *         description: Invalid word provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
export async function GET(req: Request) {
  const url = new URL(req.url);

  const wordValidation = isValidWord(url.searchParams.get("word"));

  if (!wordValidation.valid) {
    return NextResponse.json({ error: wordValidation.error }, { status: 400 });
  }
  const word = wordValidation.normalizedWord;

  const isValidGuess = guesses.includes(word);

  const answers = await loadAnswers();
  const normalizedWord = word.toLowerCase();
  const isPastAnswer = answers.has(normalizedWord);
  return NextResponse.json({ isPastAnswer, isValidGuess });
}
