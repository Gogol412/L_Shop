import React from "react";
import { createRoot } from "react-dom/client";
import { Screen } from "./index";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<Screen />);
}
