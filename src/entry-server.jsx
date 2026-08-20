import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export function render(url) {
  return renderToString(
    <React.StrictMode>
      <App url={url} />
    </React.StrictMode>
  );
}
