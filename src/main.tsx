import { createRoot } from "react-dom/client";
import Submit from "./pages/Submit/Submit.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home/Home.tsx";
import List from "./pages/List/List.tsx";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/list" element={<List />} />
      </Routes>

      <ToastContainer />
    </QueryClientProvider>
  </BrowserRouter>,
);
