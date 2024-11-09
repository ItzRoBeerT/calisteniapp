import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000",
        foreground: "var(--foreground)",
        primary: "#fff",
        secondary: "#32D74B",
        secondaryHover: "#2BB543",
        tertiary: "#007AFF",
        tertiaryHover: "#006FE0",
      },
    },
  },
  plugins: [],
} satisfies Config;
