/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ── Base ──────────────────────────────────────────────
        bg:       '#FFFFFF',   // page background (pure white)
        surface:  '#FFFFFF',   // card/panel background (white)
        surface2: '#F8FAFC',   // elevated surface, hover bg (slate-50)
        border:   '#E2E8F0',   // borders (slate-200)

        // ── Text ──────────────────────────────────────────────
        text:     '#0F172A',   // primary text (slate-900)
        muted:    '#64748B',   // secondary text (slate-500)

        // ── Accents ───────────────────────────────────────────
        accent:   '#14B8A6',   // teal-500 (primary CTA, active states)
        accent2:  '#10B981',   // emerald-500 (secondary highlights)
        accent3:  '#06B6D4',   // cyan-400 (tertiary)

        // ── Status ────────────────────────────────────────────
        success:  '#22C55E',
        warning:  '#F59E0B',
        danger:   '#EF4444',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card:  '16px',
        input: '8px',
      },
    },
  },
  plugins: [],
}
