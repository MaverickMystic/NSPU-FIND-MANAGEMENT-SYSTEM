import "./index.css"; // import css

import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import BoxContextProvider from "./boxContext";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import AuthContextProvider from "./utils/AuthContext";
import SearchContextProvider from "./utils/SearchContext";

const queryclient = new QueryClient();
const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <QueryClientProvider client={queryclient}>
    <React.StrictMode>
     <AuthContextProvider>
      <SearchContextProvider>
      <BoxContextProvider>
        <App />
      </BoxContextProvider>
      </SearchContextProvider>
     </AuthContextProvider>
    </React.StrictMode>
  </QueryClientProvider>
);
