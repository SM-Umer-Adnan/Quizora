import { motion, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface HeaderProps {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

const headerVariants: Variants = {
  hidden: { y: -50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

const btnTap = { scale: 0.95 };

export default function Header({ theme, setTheme }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <motion.header
      className="flex justify-between items-center p-4 border-b bg-white dark:bg-gray-900 shadow-md"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 cursor-pointer tracking-tight flex items-center gap-2 truncate"
        whileHover={{ scale: 1.05, rotate: 1 }}
        onClick={() => navigate("/")}
      >
        Quizora
        <img
          src="/icon.png"
          alt="Target"
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
        />
      </motion.h1>

      <div className="flex gap-3">
        {}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          <Button
            variant="outline"
            className="px-4 py-2 font-medium flex items-center gap-2 transition-colors duration-300"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <motion.span
              key={theme} 
              initial={{ rotate: 0, y: -5, opacity: 0 }}
              animate={{ rotate: 360, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </motion.span>
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
        </motion.div>

        {}
        <motion.button
          whileHover={{
            scale: 1.05,
            backgroundColor: theme === "dark" ? "#facc15" : "#fcd34d",
          }}
          whileTap={btnTap}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg shadow-md"
          onClick={() => navigate("/leaderboard")}
        >
          🏆 Leaderboard
        </motion.button>
      </div>
    </motion.header>
  );
}