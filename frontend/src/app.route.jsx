import { createHashRouter, Navigate } from "react-router-dom";
import Register from "./features/auth/pages/Register.jsx";
import Login from "./features/auth/pages/Login.jsx";
import AddProducts from "./features/products/pages/AddProducts.jsx";
import ProtectedRoute from "./components/Protected/Protected.jsx";
import MainLayout from "./components/Mainlayout.jsx";


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
        element: <ProtectedRoute />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: "/AddProducts",
                        element: <AddProducts />
                    }
                ]
            }
        ]
    },
    

])
