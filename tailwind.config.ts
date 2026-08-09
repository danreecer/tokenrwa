import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        night: "#080808",
        muted: "#6F7077",
        body: "#F7F7F8",
        violet: {
          DEFAULT: "#8C5CFF",
          soft: "#B898FF",
          lilac: "#DCCBFF",
          faint: "#F5F0FF",
        },
        blush: "#F0B4DE",
        edge: "rgba(15,15,15,0.08)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      maxWidth: {
        shell: "85rem",
        prose: "44rem",
      },
      boxShadow: {
        lift: "0 30px 80px -30px rgba(140,92,255,0.35), 0 10px 30px -15px rgba(15,15,15,0.08)",
        card: "0 2px 10px rgba(15,15,15,0.03), 0 20px 50px -25px rgba(140,92,255,0.18)",
      },
    },
  },
  plugins: [],
};
export default config;
