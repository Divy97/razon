import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import ChatProvider from "./context/ChatProvider.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page.jsx";
import IndividualPost from "./components/IndividualPost.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/post/:postId",
    element: <IndividualPost />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChatProvider>
    <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.StrictMode>
  </ChatProvider>
);
