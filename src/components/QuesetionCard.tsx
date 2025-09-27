import { useState } from "react";
import { QuizQuestion } from "../lib/types";
import { motion, AnimatePresence } from "framer-motion";

type QuestionCardProps = {
  question: QuizQuestion;
  questionIndex: number;
  onAnswer: (selectedOption: string) => void;
  userSelection: string | null;
  answered: boolean;
};

export default function QuestionCard({
  question,
  answered,
  onAnswer,
  userSelection,
  questionIndex,
}: QuestionCardProps) {
  const [showHint, setShowHint] = useState(false);

  const getOptionLetter = (index: number) => String.fromCharCode(65 + index);

  const getOptionStyle = (option: string) => {
    if (!answered)
      return "bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600";

    if (option === question.answer) {
      return "bg-green-100 dark:bg-green-900/40 border-green-500 text-green-700 dark:text-green-300 font-semibold";
    }

    if (option === userSelection && userSelection !== question.answer) {
      return "bg-red-100 dark:bg-red-900/40 border-red-500 text-red-700 dark:text-red-300 font-semibold";
    }

    return "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600";
  };

  return (
    <div className="p-5 border rounded-xl shadow-sm bg-white dark:bg-gray-900 transition hover:shadow-md">
      {}
      <p className="font-semibold text-gray-800 dark:text-gray-100 mb-4 text-lg">
        {questionIndex + 1}. {question.question}
      </p>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((option, oIndex) => (
          <motion.button
            key={oIndex}
            whileTap={!answered ? { scale: 0.97 } : {}}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getOptionStyle(
              option,
            )} ${answered ? "cursor-not-allowed opacity-90" : "cursor-pointer"}`}
            onClick={() => !answered && onAnswer(option)}
            disabled={answered}
            aria-pressed={userSelection === option}
          >
            <span className="font-medium mr-2">{getOptionLetter(oIndex)})</span>
            {option}
            {answered && option === question.answer && (
              <span className="ml-3 inline-block text-xs px-2 py-0.5 rounded-full bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200">
                Correct
              </span>
            )}
            {answered &&
              option === userSelection &&
              userSelection !== question.answer && (
                <span className="ml-3 inline-block text-xs px-2 py-0.5 rounded-full bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200">
                  Your Choice
                </span>
              )}
          </motion.button>
        ))}
      </div>

      {}
      {question.hint && (
        <div className="mt-5">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-sm text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
          >
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>

          <AnimatePresence>
            {showHint && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/40 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm"
              >
                💡 {question.hint}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}