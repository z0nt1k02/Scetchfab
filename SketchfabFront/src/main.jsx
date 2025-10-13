import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ModelView from "./assets/ModelPage/ModelPage.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadModel from "./assets/InputModelWindow/UploadModel.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="" element={<App />} />
        <Route path="/model/:id" element={<ModelView />} />
        <Route path="/upload" element={<UploadModel />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
