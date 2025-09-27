import Groq from "groq-sdk";
import { QuizQuestion } from "./types";
import { schema } from "./schema";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || process.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateQuiz(topic: string): Promise<QuizQuestion[]> {
  const jsonSchema = JSON.stringify(schema, null, 4);

  const chat_completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a quiz generator that creates multiple-choice questions.
Return ONLY a raw JSON array (no wrapping object, no keys) of exactly 10 items.
Each item must have:
- question (string)
- options (array of 4 choices, only one correct)
- answer (string, must match one of the options)
- hint (string)

⚠️ Do not wrap the array inside an object like {quiz_questions: [...]}. 
The output must strictly follow this JSON schema: ${jsonSchema}`,
      },
      {
        role: "user",
        content: `Create a quiz from the given content: ${topic}`,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    stream: false,
    response_format: { type: "json_object" },
  });

  const content = chat_completion.choices[0].message.content;

  if (!content) {
    throw new Error("Empty response from model");
  }

  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Invalid JSON from model");
  }

  // ✅ Handle all possible formats
  if (Array.isArray(parsed)) {
    return parsed as QuizQuestion[];
  }

  if (parsed.items && Array.isArray(parsed.items)) {
    return parsed.items as QuizQuestion[];
  }

  if (parsed.quiz_questions && Array.isArray(parsed.quiz_questions)) {
    return parsed.quiz_questions as QuizQuestion[];
  }

  console.error("Unexpected quiz format:", parsed);
  throw new Error("Could not extract quiz questions from response");
}
