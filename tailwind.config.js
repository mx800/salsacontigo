/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				// Salsa Contigo Theme: Black + Red
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: '#000000',
				foreground: '#ffffff',
				primary: {
					DEFAULT: '#dc2626', // Vibrant red
					light: '#ef4444',
					dark: '#991b1b',
					foreground: '#ffffff',
				},
				secondary: {
					DEFAULT: '#1a1a1a', // Dark gray
					light: '#2a2a2a',
					foreground: '#f5f5f5',
				},
				accent: {
					DEFAULT: '#dc2626',
					foreground: '#ffffff',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: '#2a2a2a',
					foreground: '#e5e5e5',
				},
				popover: {
					DEFAULT: '#1a1a1a',
					foreground: '#ffffff',
				},
				card: {
					DEFAULT: '#1a1a1a',
					foreground: '#ffffff',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'fade-in': {
					from: { opacity: 0, transform: 'translateY(20px)' },
					to: { opacity: 1, transform: 'translateY(0)' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'parallax': {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(-50px)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'parallax': 'parallax 1s ease-out',
			},
			fontFamily: {
				'script': ['"Dancing Script"', 'cursive'],
				'elegant': ['"Great Vibes"', 'cursive'],
				'sans': ['Inter', 'system-ui', 'sans-serif'],
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
