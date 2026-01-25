import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx"; // your main App component with Routes
import "./index.css";
import { GAListener } from './GAListener';
import { HelmetProvider } from 'react-helmet-async'; // <-- add this

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider> {/* <-- wrap your app with this */}
      <BrowserRouter>
        {/* GAListener must be inside BrowserRouter */}
        <GAListener />
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
