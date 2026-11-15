import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./router/router.jsx";
import { store } from "./app/store.js";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AppRoutes />
  </Provider>
);
