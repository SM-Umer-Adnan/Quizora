import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import { generateQuiz } from "./lib/services";
import type { QuizQuestion } from "./lib/types";
import QuestionCard from "./components/QuesetionCard";
import SkeletonLoading from "./components/SkeletonLoading";
import Spinner from "./components/ui/spinner";
import { useTheme } from "./providers/theme-provider";



function App() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate(); // ✅ get navigate function

  const [input, setInput] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);

  // New features
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  

  // Timer (⏳)
  const [timeLeft, setTimeLeft] = useState<number>(60); // 1 min default

  // Leaderboard (🏆)
  const [leaderboard, setLeaderboard] = useState<
    { name: string; score: number; difficulty: string }[]
  >([]);

  // UI states
  const [inputFocused, setInputFocused] = useState(false);

  // Timer effect
  useEffect(() => {
    if (hasGenerated && !quizFinished && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && !quizFinished) {
      setQuizFinished(true);
    }
  }, [timeLeft, hasGenerated, quizFinished]);

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError("Please enter a topic or content to generate questions");
      return;
    }
    if (!difficulty) {
      setError("Please select a difficulty level");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const questions = await generateQuiz(`${input} (difficulty: ${difficulty})`);
      setQuiz(questions);
      setInput("");
      setHasGenerated(true);
      setQuizFinished(false);

      setUserAnswers(new Array(questions.length).fill(null));
      setAnsweredQuestions(new Array(questions.length).fill(false));
      setScore(0);
      setTimeLeft(60); // reset timer
    } catch (err) {
      setError("Failed to generate quiz. Please try again.");
      console.error("Quiz generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionIndex: number, selectedOption: string) => {
    if (answeredQuestions[questionIndex]) return;

    const newUserAnswers = [...userAnswers];
    newUserAnswers[questionIndex] = selectedOption;
    setUserAnswers(newUserAnswers);

    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[questionIndex] = true;
    setAnsweredQuestions(newAnsweredQuestions);

    if (selectedOption === quiz[questionIndex].answer) {
      setScore((prevScore) => prevScore + 1);
    }

    if (newAnsweredQuestions.every((ans) => ans)) {
      setQuizFinished(true);
    } else {
      // 👇 Wait a tick for React to update DOM, then scroll
      setTimeout(() => {
        const nextQuestion = document.getElementById(
          `question-${questionIndex + 1}`
        );
        if (nextQuestion) {
          nextQuestion.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 150);
    }
  };

  const saveToLeaderboard = (name: string) => {
    setLeaderboard((prev) => [...prev, { name, score, difficulty: difficulty! }]);
  };

  const progress = quiz.length
    ? (answeredQuestions.filter(Boolean).length / quiz.length) * 100
    : 0;

  // framer-motion variants
  const containerVariants = {
    hidden: { opacity: 0, y: 8 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
  };

  const btnHover = { scale: 1.02 };
  const btnTap = { scale: 0.98 };

  

  return (
    <div className={`flex flex-col min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Top Bar with Theme Toggle */}


      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {!hasGenerated && !loading ? (
            <motion.div
              key="home"
              variants={containerVariants}
              initial="hidden"
              animate="enter"
              exit="exit"
              className="flex flex-col justify-center items-center h-screen px-4"
            >
         <motion.div className="text-center mb-12 px-4 sm:px-0">
  {/* 🎯 Header */}
 <motion.h2
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.6 }}
      className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-4"
      style={{
        fontFamily: "'Nunito', sans-serif",
        color: theme === "dark" ? "#FFFFFF" : "#000000", // dynamic color
      }}
    >
      Exercise and Test Generator
    </motion.h2>



  {/* 📖 Subtitle */}
  <motion.p
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15, duration: 0.5 }}
    className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
  >
    Enter a topic below, pick a difficulty, and watch as we generate multiple-choice questions for you instantly.  
    <span className="font-semibold" style={{ color: ' rgb(199 162 50 / var(--tw-text-opacity, 1))' }}> Examples: "Photosynthesis", "React Hooks"</span>
  </motion.p>
</motion.div>


              {/* Card w/ textarea + difficulties */}
              <motion.div
                initial={{ opacity: 0, scale: 0.995 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.06 }}
                className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
              >
                <div className="mb-4">
                  <label className="text-sm font-semibold block mb-2">Topic</label>

                  <motion.div
                    animate={inputFocused ? { boxShadow: "0 10px 30px rgba(99,102,241,0.12)" } : { boxShadow: "0 6px 18px rgba(2,6,23,0.04)" }}
                    transition={{ type: "spring", stiffness: 220, damping: 20 }}
                    className="rounded-xl"
                  >
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      className="w-full resize-none rounded-xl p-4 placeholder-gray-500 dark:placeholder-gray-400 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-400"
                      placeholder="Enter topic (e.g. JavaScript closures, World War II, Cellular respiration)"
                      rows={4}
                    />
                  </motion.div>

                  {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex gap-2 items-center">
                    {(["easy", "medium", "hard"] as const).map((level, idx) => (
                      <motion.button
                        key={level}
                        whileHover={btnHover}
                        whileTap={btnTap}
                        onClick={() => setDifficulty(level)}
                        aria-pressed={difficulty === level}
                        className={`px-4 py-2 rounded-lg font-semibold border ${
                          difficulty === level
                            ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-transparent"
                            : "bg-transparent text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700"
                        }`}
                        style={{
                          transition: "all 180ms ease",
                        }}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </motion.button>
                    ))}
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleGenerate}
                      disabled={loading}
                      className="h-12 rounded-xl w-40 text-white"
                      style={{ background: "rgb(255 204 76/var(--tw-bg-opacity,1))",fontWeight: "700", color: "black" }}
                    >
                      {loading ? <Spinner /> : "Generate"}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

            </motion.div>
          ) : (
            <motion.div
              key={hasGenerated ? "quiz" : "loading"}
              variants={containerVariants}
              initial="hidden"
              animate="enter"
              exit="exit"
              className="max-w-3xl mx-auto px-4 py-8 mb-20"
            >
              {loading ? (
                <div className="space-y-8">
                  <SkeletonLoading />
                </div>
              ) : quizFinished ? (
                // ✅ Summary screen
<div className="flex flex-col items-center space-y-8 py-12 px-6 sm:px-12  dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-3xl shadow-xl max-w-2xl mx-auto">
  {/* 🎉 Completion Header */}
  <motion.h2 
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
    className="text-3xl sm:text-4xl font-extrabold text-black-600 dark:text-white-400 text-center"
  >
    Quiz Completed 🎉
  </motion.h2>

  {/* Score Display */}
  <motion.p
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.1, duration: 0.4 }}
    className="text-xl sm:text-2xl font-medium text-gray-700 dark:text-gray-200 text-center"
  >
    You scored <span className="font-bold" style={{ color: "rgb(199 162 50/var(--tw-text-opacity,1))" }}>{score}</span> out of <span className="font-semibold">{quiz.length}</span>
  </motion.p>

  {/* Input for Name */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2, duration: 0.4 }}
    className="flex flex-col items-center space-y-2 w-full"
  >
    <input
      type="text"
      placeholder="Enter your name"
      className="w-full sm:w-64 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 transition"
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.currentTarget.value) {
          const name = e.currentTarget.value;

          // Save to local leaderboard state
          saveToLeaderboard(name);

          // Save to localStorage so Leaderboard page updates automatically
          const existing = localStorage.getItem("askme-leaderboard");
          const leaderboardData = existing ? JSON.parse(existing) : [];
          const newEntry = {
            name,
            score,
            difficulty: difficulty!,
            date: new Date().toLocaleString(),
          };
          localStorage.setItem(
            "askme-leaderboard",
            JSON.stringify([...leaderboardData, newEntry])
          );

          // Clear input
          e.currentTarget.value = "";

          // Redirect to leaderboard page
          navigate("/leaderboard");
        }
      }}
    />
    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Press Enter to save your score</p>
  </motion.div>

  {/* Try Another Quiz Button */}
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Button
      onClick={() => {
        setHasGenerated(false);
        setQuizFinished(false);
      }}
      className="w-full sm:w-48 h-14 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
      style={{ background: "rgb(199 162 50/var(--tw-bg-opacity,1))", fontWeight: "700", color: "black" }}
    >
      Try Another Quiz
    </Button>
  </motion.div>

  {/* Leaderboard Preview */}
  {leaderboard.length > 0 && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4"
    >
      <h3 className="text-xl font-bold text-center text-indigo-600 dark:text-indigo-400">🏆 Leaderboard</h3>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {leaderboard.map((entry, idx) => (
          <li key={idx} className="flex justify-between items-center py-2">
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {entry.name} <span className="text-sm text-gray-500 dark:text-gray-400">({entry.difficulty})</span>
            </span>
            <span className="font-bold text-indigo-500 dark:text-indigo-300">{entry.score}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )}
</div>

              ) : (
                quiz.length > 0 && (
                  <div className="space-y-6">
                    {/* Progress bar + Timer */}
                    <div className="sticky top-0 z-20 pb-2 bg-gray-50 dark:bg-gray-900">
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ background: "rgb(199 162 50/var(--tw-text-opacity,1))"}}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ ease: "easeOut", duration: 0.5 }}
                        />
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border flex justify-between items-center">
                        <div className="text-sm">⏳ Time Left: {timeLeft}s</div>
                        <div className="font-medium">Score: {score}/{answeredQuestions.filter(Boolean).length} answered</div>
                      </div>
                    </div>

                    {/* Quiz questions */}
                    <div className="space-y-8">
                      {quiz.map((question, index) => (
                        <motion.div key={index} className="scroll-mt-4" id={`question-${index}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
                          <QuestionCard
                            question={question}
                            questionIndex={index}
                            onAnswer={(selectedOption) =>
                              handleAnswer(index, selectedOption)
                            }
                            userSelection={userAnswers[index]}
                            answered={answeredQuestions[index]}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>



    </div>
  );
}

export default App;
