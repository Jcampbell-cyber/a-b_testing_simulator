import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { GAListener } from './GAListener';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App /> 
    </BrowserRouter>
  </React.StrictMode>
);

function App() {
  return (
    <BrowserRouter>
      <GAListener />
      <Routes>
        {/* your routes here */}
      </Routes>
    </BrowserRouter>
  );
}

