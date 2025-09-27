import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use"; // optional hook for responsive confetti

interface ScoreEntry {
  name: string;
  score: number;
  difficulty: string;
  date: string;
}

export default function Leaderboard() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const { width, height } = useWindowSize(); // for confetti sizing

  // Live update from localStorage
  useEffect(() => {
    const updateScores = () => {
      const saved = localStorage.getItem("askme-leaderboard");
      if (saved) setScores(JSON.parse(saved));
    };

    updateScores();
    window.addEventListener("storage", updateScores);

    return () => {
      window.removeEventListener("storage", updateScores);
    };
  }, []);

  // Sort scores by highest points first
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
  };

  const getRankGradient = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    if (rank === 2) return "bg-gradient-to-r from-gray-400 to-gray-600 text-white";
    if (rank === 3) return "bg-gradient-to-r from-yellow-700 to-yellow-900 text-white";
    return "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
  };

  return (
    <div className="mt-8 p-6 rounded-3xl shadow-xl bg-white dark:bg-gray-900 max-w-md mx-auto relative">
      {/* Confetti for top scorer */}
      {sortedScores[0] && <Confetti width={width} height={height} numberOfPieces={250} recycle={false} />}

      <h3 className="text-2xl font-bold mb-6 text-center text-black-600 dark:text-white-400">
        🏆 Leaderboard
      </h3>

      {scores.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          No scores yet. Play a quiz!
        </p>
      ) : (
        <motion.ul
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {sortedScores.map((s, i) => (
              <motion.li
                key={i}
                variants={itemVariants}
                className={`flex justify-between items-center p-4 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer ${getRankGradient(i + 1)}`}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="text-lg font-bold"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                  >
                    {i + 1}
                  </motion.div>
                  <div>
                    <motion.div
                      className="font-semibold"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {s.name}
                    </motion.div>
                    <div className="text-xs opacity-80">{s.difficulty}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-lg">{s.score} pts</span>
                  <span className="text-xs opacity-70">{s.date}</span>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
