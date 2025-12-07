import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeStorage } from "./Context/ThemeContext";
import { AutoplayStorage } from "./Context/AutoplayContext";
import { LanguageStorage } from "./Context/LanguageContext";
import { PlaylistStorage } from "./Context/PlaylistContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ToastContainer position="top-right" newestOnTop closeOnClick />
    <PlaylistStorage>
      <AutoplayStorage>
        <LanguageStorage>
          <ThemeStorage>
            <App />
          </ThemeStorage>
        </LanguageStorage>
      </AutoplayStorage>
    </PlaylistStorage>
  </React.StrictMode>
);
