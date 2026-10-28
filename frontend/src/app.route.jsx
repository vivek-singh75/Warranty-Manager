import { createHashRouter, Navigate } from "react-router-dom";
import Register from "./features/auth/pages/Register.jsx";
import Login from "./features/auth/pages/Login.jsx";
import AddProducts from "./features/products/pages/AddProducts.jsx";



export const router = createHashRouter([
    {
        path: "/",
        element: <Navigate to="/register" replace />
    },

    {
        path : "/register",
        element: <Register />
    },

    {
        path: "/login",
        element: <Login/>
    },

    {
        path: "/AddProducts",
        element: <AddProducts/>
    },


])
