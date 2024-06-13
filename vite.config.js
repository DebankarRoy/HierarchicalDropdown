import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint";
import path from "path";
import svgr from "vite-plugin-svgr";
// import { resolve } from "path";
export default defineConfig({
	server: {
		port: 3000,
	},
	resolve: {
		alias: [{ find: "@", replacement: path.resolve(__dirname, "./src") }],
	},
	base: "./",
	plugins: [
		react(),
		svgr(),
		eslintPlugin({
			cache: false,
			include: ["./src/**/*.+(js|jsx|ts|tsx)"],
		}),
	],
});
