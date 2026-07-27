import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#120E0A",
        charcoal: "#1C1712",
        "charcoal-2": "#241D16",
        gold: "#C6992D",
        "gold-light": "#E9CB7E",
        "gold-dim": "#8A6C24",
        cream: "#F3ECDB",
        "cream-dim": "#CFC5AC",
        maroon: "#3A1810",
        success: "#4C7A5B",
        warning: "#D98F3A",
        error: "#A63D2F",
        whatsapp: "#25D366",
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "serif"],
        cinzel: ["var(--font-cinzel)", "serif"],
        serif: ["var(--font-eb-garamond)", "serif"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "0px",
      },
      boxShadow: {
        "depth-sm": "0 2px 8px rgba(0,0,0,0.35)",
        "depth-md": "0 8px 24px rgba(0,0,0,0.45)",
        "depth-lg": "0 20px 48px rgba(0,0,0,0.55)",
        "gold-sm": "0 0 0 1px rgba(198,153,45,0.35)",
        "gold-glow": "0 4px 28px rgba(198,153,45,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
