import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0A",
        surface: "#141414",
        card: "#1C1C1C",
        border: "#2A2A2A",
        accent: "#FF6B35",
        gold: "#C4A35A",
        muted: "#555555",
        text: "#E8E8E8",
        subtle: "#888888",
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        mono: ["var(--font-ibm-mono)", "monospace"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
