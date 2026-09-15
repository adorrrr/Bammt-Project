/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 1. Unified Gangchill Navy Blue Liquid Glass Color System
        'gangchill-canvas': '#F4F7FB', // Crisp Cool Ice Canvas (Liquid Glass backdrop)
        'gangchill-surface': '#FFFFFF', // Clean White glass surface
        'gangchill-border': 'rgba(11, 25, 44, 0.09)', // Subtle navy hairline border
        'gangchill-ink': {
          DEFAULT: '#0B192C', // Deep Midnight Navy primary text
          muted: '#475569', // Cool Slate Navy secondary text
          light: '#8297AD', // Soft placeholder text
          hairline: 'rgba(11, 25, 44, 0.08)',
        },

        // Navy Blue Core Brand System
        'gangchill-navy': {
          DEFAULT: '#0B192C', // Deep Navy
          deep: '#060E1A', // Midnight Navy
          surface: '#0F243E', // Navy Surface
          light: '#1E3A5F', // Slate Royal Navy
          tint: '#EDF4FB', // Ice Navy Tint
          glow: 'rgba(14, 165, 233, 0.25)',
        },
        'gangchill-blue': {
          DEFAULT: '#15325E', // Deep Royal Navy-Blue (was a much brighter #1D4ED8)
          deep: '#0C1F3D', // Darker hover / pressed state
          light: '#3B5998', // Muted mid-tone for secondary accents & hover borders
          bright: '#1B3E7A', // Reserved for rare emphasis — still deep, not neon
          tint: '#EEF2F8',
        },
        'gangchill-cyan': {
          DEFAULT: '#0284C7', // Ocean Electric Cyan
          deep: '#0369A1',
          light: '#38BDF8', // Sky Cyan
          tint: '#E0F2FE', // Cyan Tint
          subtle: '#F0F9FF',
        },

        // Override Tailwind's own default blue scale for the specific shades used
        // directly across components (blue-400/600/700/800), so every raw utility
        // class deepens along with the custom gangchill-blue tokens above — no need
        // to touch each component individually.
        blue: {
          400: '#4A6FA5',
          600: '#15325E',
          700: '#0C1F3D',
          800: '#081530',
        },

        // Primary Brand Token Mapping (Upgrades all existing green references to Deep Navy & Royal Blue)
        'gangchill-green': {
          DEFAULT: '#0B192C', // Deep Navy Brand Primary
          deep: '#060E1A', // Midnight Navy hover state
          light: '#15325E', // Deep Royal Navy-Blue
          tint: '#EDF4FB', // Ice Blue Tint
          subtle: '#EDF4FB',
          dark: '#060E1A',
        },
        'gangchill-fresh': {
          DEFAULT: '#0284C7', // Ocean Cyan
          light: '#38BDF8',
          tint: '#E0F2FE',
        },
        'gangchill-clay': {
          DEFAULT: '#0284C7', // Cyan Accent
          deep: '#0369A1',
          light: '#38BDF8',
          tint: '#E0F2FE',
        },
        'gangchill-gold': {
          DEFAULT: '#0284C7', // Oceanic Cyan Accent
          deep: '#0369A1',
          dark: '#0369A1',
          light: '#38BDF8',
          tint: '#E0F2FE',
          subtle: '#E0F2FE',
        },
        'gangchill-sand': '#CBD5E1', // Cool Slate Sand
        'gangchill-water': '#64748B', // Water Slate
        'gangchill-silver': '#E2E8F0', // Ice Silver
        'gangchill-earth': {
          DEFAULT: '#475569',
          deep: '#0B192C',
          light: '#8297AD',
          tint: '#EDF4FB',
        },
        'gangchill-text': {
          DEFAULT: '#0B192C',
          muted: '#475569',
        },

        // Backward compatibility aliases
        'gangchil-green': {
          DEFAULT: '#0B192C',
          dark: '#060E1A',
          light: '#15325E',
          subtle: '#EDF4FB',
        },
        'gangchil-gold': {
          DEFAULT: '#0284C7',
          dark: '#0369A1',
          light: '#38BDF8',
          subtle: '#E0F2FE',
        },
        'gangchil-canvas': '#F4F7FB',
        'gangchil-surface': '#FFFFFF',
        'gangchil-border': 'rgba(11, 25, 44, 0.09)',
        'gangchil-earth': '#475569',
        'gangchil-text': {
          DEFAULT: '#0B192C',
          muted: '#475569',
        },
      },
      borderRadius: {
        'natural-sm': '6px',
        'natural': '10px',
        'natural-lg': '14px',
        'glass': '20px',
        'glass-lg': '28px',
      },
      boxShadow: {
        'warm': '0 8px 25px -4px rgba(11, 25, 44, 0.07), 0 2px 6px -1px rgba(11, 25, 44, 0.04)',
        'warm-lg': '0 16px 36px -6px rgba(11, 25, 44, 0.12), 0 4px 12px -2px rgba(11, 25, 44, 0.06)',
        'glass': '0 10px 30px -5px rgba(11, 25, 44, 0.07), inset 0 1.5px 2px rgba(255, 255, 255, 0.95)',
        'glass-lg': '0 20px 40px -8px rgba(11, 25, 44, 0.12), inset 0 1.5px 2px rgba(255, 255, 255, 1)',
        'glass-glow': '0 12px 36px -6px rgba(2, 132, 199, 0.22), inset 0 1.5px 2px rgba(255, 255, 255, 0.9)',
        'glass-navy': '0 20px 40px -10px rgba(6, 14, 26, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
      },
      fontFamily: {
        bangla: ['"Hind Siliguri"', '"Anek Bangla"', '"Noto Sans Bengali"', 'sans-serif'],
        serifBangla: ['"Noto Serif Bengali"', '"Tiro Bangla"', 'serif'],
        sans: ['"Inter"', '"Hind Siliguri"', 'sans-serif'],
      },
      letterSpacing: {
        'bangla-wide': '0.04em',
      }
    },
  },
  plugins: [],
}
