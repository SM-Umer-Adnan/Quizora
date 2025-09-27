import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Leaderboard from "./components/Leaderboard.tsx";
import Header from "./components/Header.tsx";
import FloatingGithubButton from "./components/FloatingGithubButton.tsx"; 
import { ThemeProvider, useTheme } from "./providers/theme-provider.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Watermark from "./components/Watermark.tsx";

function Root() {
  const { theme, setTheme } = useTheme(); 

  return (
    <>
      <Header theme={theme} setTheme={setTheme} />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>

      {}
      <FloatingGithubButton repoUrl="https://github.com/SM-Umer-Adnan/Quizora" />

      <footer className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">
        Made by Syed Muhammad Umer Adnan
      </footer>

      <Watermark />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);