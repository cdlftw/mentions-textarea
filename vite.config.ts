import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const isLibrary = mode === "library";

	return {
		plugins: [
			react(),
			...(isLibrary ? [tailwindcss(), dts({ insertTypesEntry: true })] : [tailwindcss()]),
		],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		...(isLibrary && {
			build: {
				lib: {
					entry: path.resolve(__dirname, "src/index.ts"),
					name: "MentionsTextarea",
					fileName: (format) => `index.${format}.js`,
					formats: ["es"],
				},
				rollupOptions: {
					external: ["react", "react-dom", "react-textarea-autosize"],
					output: {
						globals: {
							react: "React",
							"react-dom": "ReactDOM",
							"react-textarea-autosize": "TextareaAutosize",
						},
					},
				},
				outDir: "dist",
				sourcemap: true,
			},
		}),
	};
});
