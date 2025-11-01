import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-dark)",
        foreground: "var(--text-primary)",
        cyber: {
          cyan: "#00d9ff",
          cyanGlow: "#00ffff",
          magenta: "#ff00ff",
          purple: "#9d4edd",
          green: "#00ff88",
          yellow: "#ffd60a",
          dark: "#000814",
          navy: "#0a1628",
          teal: "#0d3d4f",
          border: "#1a2332",
        },
        text: {
          primary: "#e8f4f0",
          secondary: "#94a3b8",
          muted: "#64748b",
        },
      },
      fontFamily: {
        mono: ['Courier New', 'Consolas', 'monospace'],
      },
      fontSize: {
        '7xl': '5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      letterSpacing: {
        'wider': '0.05em',
        'widest': '0.1em',
      },
      borderRadius: {
        'cyber': 'var(--radius-md)',
      },
      backgroundImage: {
        "grid-pattern": "url('/grid.svg')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in forwards",
        "slide-up": "slideUp 0.3s ease-out forwards",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "float": "float 4s ease-in-out infinite",
        "scan": "scan 8s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(0, 217, 255, 0.4)",
          },
          "50%": { 
            boxShadow: "0 0 40px rgba(0, 217, 255, 0.7)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scan: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

