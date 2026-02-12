import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        "card-border": "var(--color-card-border)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Courier New", "monospace"],
        body: ["var(--font-body)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        "glow-primary": "0 0 20px rgba(139, 92, 246, 0.3)",
        "glow-secondary": "0 0 20px rgba(167, 139, 250, 0.2)",
        "glow-cta": "0 0 30px rgba(251, 191, 36, 0.3)",
      },
      backgroundImage: {
        "gradient-time": "linear-gradient(135deg, #8B5CF6, #A78BFA, #3B82F6)",
        "gradient-cta": "linear-gradient(135deg, #FBBF24, #F59E0B)",
      },
      animation: {
        "warp": "warp 2s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        warp: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.8" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(139, 92, 246, 0.3)" },
          "50%": {
            boxShadow:
              "0 0 30px rgba(139, 92, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.3)",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
