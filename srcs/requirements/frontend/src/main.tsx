import ReactDOM from "react-dom/client";
import axios from "axios";
import "./index.scss";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./provider/AppContext.tsx";

axios.defaults.baseURL = import.meta.env.VITE_BACK_API;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AppProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppProvider>
);
