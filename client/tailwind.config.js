/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: '#111827',
        cardBg: 'rgba(255, 255, 255, 0.08)',
        primaryPurple: '#8B5CF6',
        secondaryPurple: '#C4B5FD',
        hoverPurple: '#A78BFA',
        textSecondary: '#D1D5DB',
        textMuted: '#9CA3AF',
        successGreen: '#10B981',
        warningAmber: '#F59E0B',
        errorCoral: '#EF4444',
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0px 12px 40px rgba(139, 92, 246, 0.15)',
        'glow-purple': '0px 0px 20px rgba(139, 92, 246, 0.25)',
        'glow-purple-strong': '0px 0px 35px rgba(196, 181, 253, 0.45)',
      },
      borderRadius: {
        'glass-card': '22px',
      }
    },
  },
  plugins: [],
}


