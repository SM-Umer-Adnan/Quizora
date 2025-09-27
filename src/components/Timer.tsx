import { useEffect, useState } from "react";

interface TimerProps {
  duration: number; 
  onTimeUp: () => void;
  resetKey?: number; 
}

export default function Timer({ duration, onTimeUp, resetKey }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, resetKey]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  return (
    <div className="text-sm font-medium text-gray-600 dark:text-gray-200">
      ⏳ {timeLeft}s left
    </div>
  );
}