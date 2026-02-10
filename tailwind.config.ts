import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "midnight": "#0b1021",
        "electric": "#7c3aed",
        "aqua": "#00e0ff",
        "slate": "#111827"
      },
      backgroundImage: {
        "grid": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
        "glow": "radial-gradient(circle at 20% 20%, rgba(124,58,237,0.35), transparent 35%), radial-gradient(circle at 80% 10%, rgba(0,224,255,0.25), transparent 30%)"
      }
    }
  },
  plugins: []
};

export default config;
