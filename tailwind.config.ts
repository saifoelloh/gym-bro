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
        "surface-hover": "#1E1E1E",
        card: "#1C1C1C",
        border: "#2A2A2A",
        "border-subtle": "#333333",
        accent: "#FF6B35",
        gold: "#C4A35A",
        muted: "#555555",
        foreground: "#E8E8E8",
        subtle: "#888888",
        error: "#EF4444",
        success: "#22C55E",
        info: "#3B82F6",
        assisted: "#4ECDC4",
        "assisted-subtle": "rgba(78, 205, 196, 0.1)",
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        mono: ["var(--font-ibm-mono)", "monospace"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        'nano': ['10px', '14px'],
        'micro': ['11px', '16px'],
      },
      padding: {
        'safe-auth': 'calc(env(safe-area-inset-bottom) + 5rem)',
      }
    },
  },
  plugins: [],
};

export default config;
