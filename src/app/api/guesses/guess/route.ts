import { loadAnswers } from "@/api-biz/answers";
import { guesses } from "@/lib/guesses";
import { NextResponse } from "next/server";

function validateParams(options: Record<string, unknown>):
  | {
      valid: true;
      options: {
        /**
         * Defaults to 1
         */
        limit: number;
      };
    }
  | { valid: false; reason: string } {
  const limit = Number(options.limit ?? 1);
  if (isNaN(limit) || limit < 1) {
    return { valid: false, reason: "Limit must be a positive number" };
  }
  return {
    valid: true,
    options: {
      limit,
    },
  };
}

/**
 * @swagger
 * /api/guesses/guess:
 *   get:
 *     summary: Returns some guesses
 *     description: Returns a list of random guesses that are valid answers but not in the answers list from the Rock Paper Shotgun website.
 *     operationId: guess
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: The number of random guesses to return.
 *     responses:
 *       200:
 *         description: A list of random guesses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 guesses:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Invalid request parameters
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

  const validationResult = validateParams({
    limit: url.searchParams.get("limit"),
  });

  if (!validationResult.valid) {
    return NextResponse.json(
      { error: validationResult.reason },
      { status: 400 }
    );
  }
  const { limit } = validationResult.options;

  const answers = await loadAnswers();

  const randomGuesses: string[] = [];
  while (randomGuesses.length < limit) {
    const randomIndex = Math.floor(Math.random() * guesses.length);
    const randomGuess = guesses[randomIndex]!;
    if (!answers.has(randomGuess) && !randomGuesses.includes(randomGuess)) {
      randomGuesses.push(randomGuess);
    }
  }

  return NextResponse.json({
    guesses: randomGuesses.sort((a, b) => a.localeCompare(b)),
  });
}
