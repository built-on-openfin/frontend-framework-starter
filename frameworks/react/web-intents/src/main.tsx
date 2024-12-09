import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@openfin/core-web/styles.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
