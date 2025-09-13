import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import "./mocks/enable-msw"; // ✅ 이 한 줄만 추가 (TLA로 준비 완료까지 대기)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);