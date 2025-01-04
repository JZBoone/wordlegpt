import { loadAnswers } from "@/api-biz/answers";
import { guesses } from "@/lib/guesses";
import { NextResponse } from "next/server";

function validateParams(options: Record<string, unknown>):
  | {
      valid: true;
      options: {
        /**
         * Defaults to 5
         */
        limit: number;
        /**
         * Regex pattern
         */
        pattern: RegExp;
      };
    }
  | { valid: false; reason: string } {
  const { pattern } = options;
  if (typeof pattern !== "string") {
    return { valid: false, reason: "Expected to receive a string" };
  }
  let regexPattern: RegExp;
  try {
    regexPattern = new RegExp(pattern, "i");
  } catch (e) {
    console.error(`Invalid regex pattern: ${pattern}`);
    console.error(e);
    return { valid: false, reason: "Invalid regex pattern" };
  }

  const limit = Number(options.limit ?? 5);

  if (isNaN(limit) || limit < 1) {
    return { valid: false, reason: "Limit must be a positive number" };
  }
  return {
    valid: true,
    options: {
      limit,
      pattern: regexPattern,
    },
  };
}

/**
 * @swagger
 * /api/guesses/match:
 *   post:
 *     summary: Retrieve matching guesses based on the provided regex pattern.
 *     operationId: getMatchingGuesses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pattern:
 *                 type: string
 *                 description: A regex pattern to match guesses. Letters should be lower case.
 *               limit:
 *                 type: integer
 *                 default: 25
 *                 description: The maximum number of matches to return.
 *     responses:
 *       200:
 *         description: A list of matching guesses.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 matches:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Invalid request parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
export async function POST(req: Request) {
  const body = await req.json();

  const validationResult = validateParams(body);

  if (!validationResult.valid) {
    return NextResponse.json(
      { error: validationResult.reason },
      { status: 400 }
    );
  }
  const { limit, pattern } = validationResult.options;

  console.log(
    `Matching guesses for pattern: ${validationResult.options.pattern}`
  );

  const answers = await loadAnswers();

  const matches = guesses.filter((guess) => {
    if (answers.has(guess)) {
      return false;
    }
    return pattern.test(guess);
  });

  return NextResponse.json({
    matches: matches
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
      .sort((a, b) => a.localeCompare(b)),
  });
}
