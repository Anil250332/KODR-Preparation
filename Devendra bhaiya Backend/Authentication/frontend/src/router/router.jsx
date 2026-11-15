import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import AuthLayout from "../layouts/AuthLayout.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Home from "../pages/Home.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";
import api from "../config/axiosInstance.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../features/auth/authSlice.js";

const AppRoutes = () => {
  let dispatch = useDispatch();

  let hydrateUser = async () => {
    try {
      let response = await api.get("/api/auth/me");
      console.log(response);
      dispatch(addUser(response.data.data));
    } catch (error) {
      console.log("error in hydration", error);
    }
  };

  useEffect(() => {
    hydrateUser();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage />,
      children: [
        { index: true, loader: () => redirect("/login") },
        {
          element: <PublicRoute />,
          children: [
            {
              path: "",
              element: <AuthLayout />,
              children: [
                { path: "login", element: <Login /> },
                { path: "register", element: <Register /> },
              ],
            },
          ],
        },
        {
          path: "main",
          element: <ProtectedRoute />,
          children: [
            {
              path: "",
              element: <MainLayout />,
              children: [{ index: true, element: <Home /> }],
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AppRoutes;
