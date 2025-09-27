import { motion } from "framer-motion";

interface FloatingGithubButtonProps {
  repoUrl: string;
}

export default function FloatingGithubButton({ repoUrl }: FloatingGithubButtonProps) {
  return (
    <motion.a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center shadow-lg cursor-pointer z-50"
      title="View on GitHub"
    >
      <svg
        className="w-7 h-7 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 0.297C5.37 0.297 0 5.667 0 12.297c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.082-.729.082-.729 1.205.085 1.838 1.238 1.838 1.238 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.932 0-1.31.468-2.38 1.235-3.22-.124-.304-.535-1.527.117-3.176 0 0 1.008-.322 3.3 1.23a11.47 11.47 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.649.242 2.872.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.805 5.624-5.475 5.921.43.372.815 1.106.815 2.23 0 1.607-.015 2.903-.015 3.293 0 .32.218.694.825.576C20.565 22.092 24 17.593 24 12.297c0-6.63-5.373-12-12-12"/>
      </svg>
    </motion.a>
  );
}