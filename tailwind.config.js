/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		screens: {
			xs: "375px",
			sm: "480px",
			md: "768px",
			lg: "976px",
			xl: "1440px",
		},
		extend: {
			boxShadow: {
				custom: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
			},
		},
	},
	plugins: [],
};
