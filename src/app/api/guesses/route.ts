import { NextResponse } from "next/server";
import { guesses } from "@/lib/guesses";
import { loadAnswers } from "@/api-biz/answers";

/**
 * @swagger
 * /api/guesses:
 *   get:
 *     description: Returns the number of guesses and potentially winning guesses
 *     operationId: getGuessesLength
 *     responses:
 *       200:
 *         description: A JSON object containing the length of guesses and potentially winning guesses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 guessesLength:
 *                   type: integer
 *                   description: The total number of guesses
 *                 potentiallyWinningGuessesLength:
 *                   type: integer
 *                   description: The number of potentially winning guesses
 */
export async function GET() {
  const answers = await loadAnswers();
  const potentiallyWinningGuesses = guesses.filter(
    (guess) => !answers.has(guess)
  );
  return NextResponse.json({
    guessesLength: guesses.length,
    potentiallyWinningGuessesLength: potentiallyWinningGuesses.length,
  });
}
