import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { MunicipalProvider } from "./context/MunicipalContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MunicipalProvider>
          <App />
        </MunicipalProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
