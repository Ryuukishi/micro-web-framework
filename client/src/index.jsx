import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Image from "./routes/Image";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/image/:filename' element={<Image />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
