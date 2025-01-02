import axios from "axios";
import * as cheerio from "cheerio";
import memoize from "memoizee";
import { DateTime } from "luxon";

async function answersWebpage(): Promise<string> {
  const response = await axios.get(
    "https://www.rockpapershotgun.com/wordle-past-answers"
  );
  return response.data;
}

function parseAnswersFromWebpage(webpage: string): string[] {
  const $ = cheerio.load(webpage);
  const allAnswersHeading = $("h2").filter((_, el) => {
    return $(el).text().toLowerCase().includes("all wordle answers");
  });
  const answers: string[] = [];
  allAnswersHeading
    .next("ul")
    .find("li")
    .each((_, el) => {
      answers.push($(el).text().trim().toLowerCase());
    });
  return answers;
}

const KNOWN_PAST_ANSWERS = ["could", "stare"];

async function _loadAnswers(): Promise<Set<string>> {
  console.log("Loading answers...");
  const pastWorldAnswersWebpage = await answersWebpage();
  const answers = parseAnswersFromWebpage(pastWorldAnswersWebpage);

  if (answers.length < 1200) {
    throw new Error("Expected at least 1200 answers");
  }
  if (KNOWN_PAST_ANSWERS.some((solution) => !answers.includes(solution))) {
    throw new Error("Expected known solutions to be present");
  }
  return new Set(answers);
}

const millisUntilMidnightPdt = (): number => {
  const now = DateTime.now().setZone("America/Los_Angeles");

  const midnight = now.endOf("day");
  const millisecondsUntilMidnight = midnight.toMillis() - now.toMillis();
  return millisecondsUntilMidnight;
};

export const loadAnswers = memoize(_loadAnswers, {
  length: 0,
  maxAge: millisUntilMidnightPdt(),
  promise: true,
});
