import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  // Use relative paths so Streamlit can serve the component from a subpath
  // inside its component iframe. Without this, Vite emits absolute
  // /assets/... URLs that 404 under Streamlit's component mount path.
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
})
