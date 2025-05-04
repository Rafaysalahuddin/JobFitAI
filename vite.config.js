import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ghPages from "vite-plugin-gh-pages";

const repoName = "JobFitAI";

export default defineConfig({
  base: `/${repoName}/`,
  plugins: [react(), ghPages()],
});
