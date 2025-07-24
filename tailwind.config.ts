import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'yoruba-red': '#A6192E',
        'yoruba-gold': '#D4A017',
        'yoruba-green': '#1A3C34',
        'yoruba-cream': '#F5E8C7',
        'yoruba-orange': '#F28C38',
        'yoruba-navy': '#1C2526',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        lora: ['Lora', 'serif'],
        noto: ['Noto Sans', 'sans-serif'],
      },
      backgroundImage: {
        'adire-pattern': "url('/images/adire-pattern.png')",
      },
      backdropBlur: {
        md: '8px',
      },
    },
  },
  plugins: [],
};
export default config; 