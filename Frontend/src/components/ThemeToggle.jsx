// src/components/ThemeToggle.jsx
import { useTheme } from "../ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 text-sm font-medium rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-black dark:text-white hover:shadow-md transition-all"
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

export default ThemeToggle;
