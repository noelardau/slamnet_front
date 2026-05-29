import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";
import "./styles/index.css";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
  