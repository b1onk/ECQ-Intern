import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx'
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./components/AuthContext"; // ✅ đảm bảo đúng đường dẫn

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);



