'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches &&
       !localStorage.getItem('theme'));

    document.documentElement.classList.toggle('dark', isDark);
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <button onClick={toggleTheme}>
      {darkMode ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
