import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, "./src/index.ts"),
			formats: ["es", "cjs"],
			fileName: (format) =>
				format === "es" ? "index.es.js" : "index.cjs",
		},
		rollupOptions: {
			external: [
				"react",
				"react-dom",
				"react/jsx-runtime",
				"react/jsx-dev-runtime",
				"react-textarea-autosize",
			],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
					"react/jsx-runtime": "jsxRuntime",
					"react/jsx-dev-runtime": "jsxDevRuntime",
					"react-textarea-autosize": "TextareaAutosize",
				},
			},
		},
	},
});
