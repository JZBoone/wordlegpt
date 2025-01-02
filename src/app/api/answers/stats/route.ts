import { NextResponse } from "next/server";
import { loadAnswers } from "@/api-biz/answers";

/**
 * @swagger
 * /api/answers/stats:
 *   get:
 *     summary: Returns the number of past Wordle answers
 *     description: Gets past Wordle answers from the Rock Paper Shotgun website and returns the number of past answers.
 *     operationId: getAnswersStats
 *     responses:
 *       200:
 *         description: A JSON object containing the length of answers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answersLength:
 *                   type: integer
 *                   description: The number of past Wordle answers.
 *                   example: 1462
 */
export async function GET() {
  const answers = await loadAnswers();
  return NextResponse.json({ answersLength: answers.size });
}
