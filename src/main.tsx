import { createRoot } from "react-dom/client";
import Submit from "./pages/Submit/Submit.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router";
import List from "./pages/List/List.tsx";
import "./index.css";
import Layout from "./components/Layout.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/submit" element={<Submit />} />
          <Route path="/list" element={<List />} />
        </Route>
      </Routes>

      <ToastContainer />
    </QueryClientProvider>
  </BrowserRouter>,
);
