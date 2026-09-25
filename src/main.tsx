import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import "./lib/analytics";

const app = (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// Production pages are pre-rendered to HTML at build time; pick that up instead of rebuilding it.
const container = document.getElementById("root")!;
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
