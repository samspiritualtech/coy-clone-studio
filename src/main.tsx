if (
  window.location.hostname.includes("sellers.") &&
  window.location.pathname === "/"
) {
  window.location.href = "https://ogura.in/join";
}

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
