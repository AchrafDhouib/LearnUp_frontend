
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./app/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2563eb", // Un bleu professionnel
          light: "#dbeafe", // Bleu clair pour les arrière-plans
          dark: "#1e40af", // Bleu foncé pour les hover
          foreground: "#ffffff"
        },
        secondary: {
          DEFAULT: "#f8fafc", // Gris très clair
          dark: "#64748b", // Gris moyen
          foreground: "#1e293b", // Gris foncé
        },
        accent: {
          DEFAULT: "#6366f1", // Indigo
          light: "#e0e7ff", // Indigo clair
          dark: "#4f46e5", // Indigo foncé
        },
        success: {
          DEFAULT: "#059669", // Vert professionnel
          light: "#d1fae5",
          dark: "#047857",
        },
        warning: {
          DEFAULT: "#ea580c", // Orange professionnel
          light: "#ffedd5",
          dark: "#c2410c",
        },
        destructive: {
          DEFAULT: "#dc2626", // Rouge professionnel
          light: "#fee2e2",
          dark: "#b91c1c",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
