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
        background: "#121212",
        surface: "#1E1E1E",     
        foreground: "var(--foreground)",
        primary: "#BB86FC",
        secondary: "#32D74B",
        secondaryHover: "#2BB543",
        tertiary: "#03DAC5",
        tertiaryHover: "#03C7B8",
      },
    },
  },
  plugins: [],
} satisfies Config;
