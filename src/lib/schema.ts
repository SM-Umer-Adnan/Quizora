import { QuizSchema } from "./types";

export const schema: QuizSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      question: {
        title: "Question",
        type: "string",
        description: "The actual question text",
      },
      options: {
        title: "Options",
        type: "array",
        items: { type: "string" },
        description: "Array of 4 possible answer choices",
      },
      answer: {
        title: "Answer",
        type: "string",
        description: "The correct answer (must be one of the options)",
      },
      hint: {
        title: "Hint",
        type: "string",
        description: "A small clue to help solve the question",
      },
    },
    required: ["question", "options", "answer", "hint"], // ✅ added "hint"
  },
};
