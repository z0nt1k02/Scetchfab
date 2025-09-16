import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ModelView from "./assets/ModelView/ModelView.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/mainpage" element={<App />} />
        <Route path="/model" element={<ModelView />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
