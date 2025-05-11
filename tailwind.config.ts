import type { Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...defaultTheme.fontFamily.mono],
        urw: ['"URW Gothic L"', 'sans-serif'],
      },
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
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
  			},
        'fadeInUp': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'float-1': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) scale(1) rotate(0deg)', borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' },
          '25%': { transform: 'translateY(-20px) translateX(10px) scale(1.05) rotate(15deg)', borderRadius: '60% 40% 30% 70% / 50% 60% 30% 40%' },
          '50%': { transform: 'translateY(10px) translateX(-20px) scale(0.95) rotate(-10deg)', borderRadius: '30% 70% 40% 60% / 60% 30% 50% 40%' },
          '75%': { transform: 'translateY(-10px) translateX(15px) scale(1) rotate(5deg)', borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%' },
        },
        'float-2': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) scale(1) rotate(0deg)', borderRadius: '70% 30% 40% 60% / 60% 30% 50% 40%' },
          '25%': { transform: 'translateY(15px) translateX(-10px) scale(1.03) rotate(-12deg)', borderRadius: '30% 70% 60% 40% / 50% 40% 70% 50%' },
          '50%': { transform: 'translateY(-10px) translateX(25px) scale(0.97) rotate(8deg)', borderRadius: '60% 40% 70% 30% / 30% 70% 40% 60%' },
          '75%': { transform: 'translateY(5px) translateX(-15px) scale(1) rotate(-5deg)', borderRadius: '40% 60% 50% 50% / 50% 50% 40% 60%' },
        },
        'float-3': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) scale(1) rotate(0deg)', borderRadius: '50% 50% 60% 40% / 40% 60% 50% 50%' },
          '25%': { transform: 'translateY(-25px) translateX(-15px) scale(1.02) rotate(10deg)', borderRadius: '40% 60% 70% 30% / 70% 30% 60% 40%' },
          '50%': { transform: 'translateY(15px) translateX(10px) scale(0.98) rotate(-18deg)', borderRadius: '70% 30% 30% 70% / 40% 50% 70% 60%' },
          '75%': { transform: 'translateY(-5px) translateX(20px) scale(1) rotate(3deg)', borderRadius: '60% 40% 40% 60% / 60% 60% 50% 50%' },
        },
        'float-4': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) scale(1) rotate(0deg)', borderRadius: '30% 70% 50% 50% / 50% 50% 70% 30%' },
          '25%': { transform: 'translateY(20px) translateX(5px) scale(1.04) rotate(-8deg)', borderRadius: '50% 50% 30% 70% / 70% 30% 60% 40%' },
          '50%': { transform: 'translateY(-15px) translateX(-20px) scale(0.96) rotate(12deg)', borderRadius: '70% 30% 60% 40% / 30% 60% 50% 70%' },
          '75%': { transform: 'translateY(10px) translateX(10px) scale(1) rotate(-2deg)', borderRadius: '40% 60% 60% 40% / 50% 50% 50% 50%' },
        },
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
        'fadeInUp': 'fadeInUp 0.5s ease-out forwards',
        'float-1': 'float-1 20s ease-in-out infinite',
        'float-2': 'float-2 25s ease-in-out infinite',
        'float-3': 'float-3 30s ease-in-out infinite',
        'float-4': 'float-4 22s ease-in-out infinite',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
