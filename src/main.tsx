import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Leaderboard from "./components/Leaderboard.tsx";
import Header from "./components/Header.tsx";
import { ThemeProvider, useTheme } from "./providers/theme-provider.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Root() {
  const { theme, setTheme } = useTheme(); // get theme from provider

  return (
    <>
      <Header theme={theme} setTheme={setTheme} />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
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
