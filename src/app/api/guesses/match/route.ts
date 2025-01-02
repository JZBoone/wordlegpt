import { loadAnswers } from "@/api-biz/answers";
import { guesses } from "@/lib/guesses";
import { NextResponse } from "next/server";

function validateParams(options: Record<string, unknown>):
  | {
      valid: true;
      options: {
        /**
         * Defaults to 25
         */
        limit: number;
        /**
         * lower case
         */
        pattern: string;
        /**
         * lower case
         */
        excludeLetters: string[];
      };
    }
  | { valid: false; reason: string } {
  const { pattern } = options;
  if (typeof pattern !== "string") {
    return { valid: false, reason: "Expected to receive a string" };
  }
  if (pattern.length !== 5) {
    return { valid: false, reason: "Pattern must be 5 characters long" };
  }
  if (!/^[a-zA-Z*]{5}$/.test(pattern)) {
    return {
      valid: false,
      reason: "Pattern can have only letters and asterisks",
    };
  }
  const limit = Number(options.limit ?? 25);
  const excludeLettersRaw = options.exclude ?? "";
  if (typeof excludeLettersRaw !== "string") {
    return { valid: false, reason: "Exclude must be a string" };
  }
  const excludeLetters = excludeLettersRaw.toLowerCase();
  if (excludeLetters.length > 0 && !/^[a-z]{1,25}$/.test(excludeLetters)) {
    return {
      valid: false,
      reason: "Exclude can have only letters and at most 25 characters",
    };
  }

  if (isNaN(limit) || limit < 1) {
    return { valid: false, reason: "Limit must be a positive number" };
  }
  return {
    valid: true,
    options: {
      limit,
      pattern: pattern.toLowerCase(),
      excludeLetters: excludeLetters.split(""),
    },
  };
}

/**
 * @swagger
 * /api/guesses/match:
 *   get:
 *     summary: Retrieve matching guesses based on the provided pattern and options.
 *     parameters:
 *       - in: query
 *         name: pattern
 *         schema:
 *           type: string
 *         required: true
 *         description: A 5-character pattern where letters represent fixed positions and asterisks (*) represent wildcards.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 25
 *         required: false
 *         description: The maximum number of matches to return.
 *       - in: query
 *         name: exclude
 *         schema:
 *           type: string
 *         required: false
 *         description: A list of letters that cannot be in the word
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
export async function GET(req: Request) {
  const url = new URL(req.url);

  const validationResult = validateParams({
    pattern: url.searchParams.get("pattern"),
    limit: url.searchParams.get("limit"),
    exclude: url.searchParams.get("exclude"),
  });

  if (!validationResult.valid) {
    return NextResponse.json(
      { error: validationResult.reason },
      { status: 400 }
    );
  }
  const { limit, pattern, excludeLetters } = validationResult.options;

  const answers = await loadAnswers();

  const matches = guesses.filter((guess) => {
    for (let i = 0; i < 5; i++) {
      if (answers.has(guess)) {
        return false;
      }
      if (excludeLetters.includes(guess[i])) {
        return false;
      }
      if (pattern[i] === "*") {
        continue;
      }
      if (pattern[i] !== guess[i]) {
        return false;
      }
    }
    return true;
  });

  return NextResponse.json({
    matches: matches
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
      .sort((a, b) => a.localeCompare(b)),
  });
}
