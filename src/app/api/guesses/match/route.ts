import { loadAnswers } from "@/api-biz/answers";
import { guesses } from "@/lib/guesses";
import { NextResponse } from "next/server";

type LetterPosition = 0 | 1 | 2 | 3 | 4;

/**
 * a-zA-Z
 */
type Letter = string;

type MatchParams = {
  /**
   * Defaults to 5
   */
  limit?: number;
  /**
   * List of letters that are correct and their position
   */
  correctLetters?: { letter: Letter; position: LetterPosition }[];
  /**
   * List of letters that cannot be in the word
   */
  eliminatedLetters?: Letter[];
  /**
   *
   */
  lettersInWrongPosition?: {
    letter: Letter;
    eliminatedPositions: LetterPosition[];
    max?: number;
  }[];
};

function validateMatchParams(
  params: MatchParams
): { valid: true; params: MatchParams } | { valid: false; reason: string } {
  const reasons: string[] = [];
  const limit = Number(params.limit ?? 5);
  if (isNaN(limit) || limit < 1) {
    reasons.push("limit must be a positive integer");
  }
  if (params.correctLetters) {
    for (const { letter, position } of params.correctLetters) {
      if (
        typeof letter !== "string" ||
        letter.length !== 1 ||
        !/[a-zA-Z]/.test(letter)
      ) {
        reasons.push(
          "correctLetters.letter must be a single alphabetic letter"
        );
      }
      if (typeof position !== "number" || position < 0 || position > 4) {
        reasons.push(
          "correctLetters.position must be a number between 0 and 4"
        );
      }
    }
  }
  if (params.eliminatedLetters) {
    for (const letter of params.eliminatedLetters) {
      if (
        typeof letter !== "string" ||
        letter.length !== 1 ||
        !/[a-zA-Z]/.test(letter)
      ) {
        reasons.push("eliminatedLetters must be a single alphabetic letter");
      }
    }
  }
  if (params.lettersInWrongPosition) {
    for (const {
      letter,
      eliminatedPositions,
      max,
    } of params.lettersInWrongPosition) {
      if (
        typeof letter !== "string" ||
        letter.length !== 1 ||
        !/[a-zA-Z]/.test(letter)
      ) {
        reasons.push(
          "lettersInWrongPosition.letter must be a single alphabetic letter"
        );
      }
      if (!Array.isArray(eliminatedPositions)) {
        reasons.push(
          "lettersInWrongPosition.eliminatedPositions must be an array"
        );
      } else {
        for (const position of eliminatedPositions) {
          if (typeof position !== "number" || position < 0 || position > 4) {
            reasons.push(
              "lettersInWrongPosition.eliminatedPositions must be an array of numbers between 0 and 4"
            );
          }
        }
      }
      if (max !== undefined && (typeof max !== "number" || max < 1)) {
        reasons.push("lettersInWrongPosition.max must be a positive integer");
      }
    }
  }
  if (reasons.length) {
    return { valid: false, reason: reasons.join(", ") };
  }
  return {
    valid: true,
    params: {
      limit: limit,
      correctLetters: (params.correctLetters || []).map(
        ({ letter, position }) => ({ letter: letter.toLowerCase(), position })
      ),
      eliminatedLetters: (params.eliminatedLetters || []).map((l) =>
        l.toLowerCase()
      ),
      lettersInWrongPosition: (params.lettersInWrongPosition || []).map(
        ({ letter, eliminatedPositions, max }) => ({
          letter: letter.toLowerCase(),
          eliminatedPositions,
          max,
        })
      ),
    },
  };
}

/**
 * @swagger
 * /api/guesses/match:
 *   post:
 *     summary: Find guesses that match the user's constraints
 *     operationId: findMatches
 *     description: This endpoint returns a list of guesses that match the user's constraints. Previous Wordle answers are filtered out.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               limit:
 *                 type: integer
 *                 description: The maximum number of guesses to return. Defaults to 5.
 *                 example: 5
 *               correctLetters:
 *                 type: array
 *                 description: List of letters that are in the correct position.
 *                 items:
 *                   type: object
 *                   properties:
 *                     letter:
 *                       type: string
 *                       description: A single alphabetic letter.
 *                       example: "a"
 *                     position:
 *                       type: integer
 *                       description: The zero-based position of the letter in the word (0-4).
 *                       example: 0
 *               eliminatedLetters:
 *                 type: array
 *                 description: List of letters that cannot be in the word.
 *                 items:
 *                   type: string
 *                   description: A single alphabetic letter.
 *                   example: "b"
 *               lettersInWrongPosition:
 *                 type: array
 *                 description: List of letters that are in the word but not in the correct positions.
 *                 items:
 *                   type: object
 *                   properties:
 *                     letter:
 *                       type: string
 *                       description: A single alphabetic letter.
 *                       example: "c"
 *                     eliminatedPositions:
 *                       type: array
 *                       description: Positions where the letter cannot be.
 *                       items:
 *                         type: integer
 *                         description: A zero-based position (0-4).
 *                         example: 1
 *                     max:
 *                       type: integer
 *                       description: The maximum number of times the letter can appear in the word.
 *                       example: 2
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
 *                   description: List of matching guesses.
 *                   items:
 *                     type: string
 *                   example: ["apple", "grape"]
 *       400:
 *         description: Invalid request parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the validation error.
 *                   example: "limit must be a positive integer"
 */
export async function POST(req: Request) {
  const body = await req.json();

  const validationResult = validateMatchParams(body);

  if (!validationResult.valid) {
    return NextResponse.json(
      { error: validationResult.reason },
      { status: 400 }
    );
  }
  const { limit, correctLetters, eliminatedLetters, lettersInWrongPosition } =
    validationResult.params;

  console.log(`Matching guesses for params: ${JSON.stringify(body)}`);

  const answers = await loadAnswers();

  const matches = guesses.filter((guess) => {
    if (answers.has(guess)) {
      return false;
    }
    if (
      correctLetters?.some(({ letter, position }) => guess[position] !== letter)
    ) {
      return false;
    }
    if (eliminatedLetters?.some((letter) => guess.includes(letter))) {
      return false;
    }
    if (
      lettersInWrongPosition?.some(({ letter, eliminatedPositions, max }) => {
        const letterCount = guess.split("").filter((l) => l === letter).length;
        if (letterCount === 0) {
          return true;
        }
        if (max && letterCount > max) {
          return true;
        }
        return eliminatedPositions.some(
          (position) => guess[position] === letter
        );
      })
    ) {
      return false;
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
