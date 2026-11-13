import { createHashRouter } from "react-router-dom";

import Register from "./features/auth/pages/Register.jsx";
import Login from "./features/auth/pages/Login.jsx";
import AddProducts from "./features/products/pages/AddProducts.jsx";
import ProtectedRoute from "./components/Protected/Protected.jsx";
import MainLayout from "./components/Mainlayout.jsx";
import ProductsDetails from "./features/products/pages/ProductsDetails.jsx";
import ProductDetailByID from "./features/products/pages/ProductDetailByID.jsx";
import Home from "./features/auth/pages/Home.jsx";
import PublicLayout from "./components/PublicLayout.jsx";




export const router = createHashRouter([

    {
        element: <PublicLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            }
        ]
    },

    {
        path: "/register",
        element: <Register />
    },

    {
        path: "/login",
        element: <Login />
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
                    },
                    {
                        path: "/productsdetails",
                        element: <ProductsDetails />
                    },
                    {
                        path: "/productDetailsById/:id",
                        element: <ProductDetailByID />
                    }
                ]
            }
        ]
    }

]);