
import { createContext, useState } from "react";

import {
    addProducts,
    submitProducts,
    detailsByQuery,
    getTopProduct,
    productDetailsByID,
    deleteProductById,
    expiringNotification
} from "../api/Products.api";

export const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [product, setProduct] = useState("");

    const handleAddProducts = async (message) => {
        try {
            const response = await addProducts(message);
            return response;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        }
    };

    const handleSubmitDetails = async (productData) => {
        try {
            const response = await submitProducts(productData);
            return response;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        }
    };

    const handleDetailsByQuery = async (userQuery) => {
        try {
            const response = await detailsByQuery(userQuery);
            return response;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        }
    };

    const handleGetTopProduct = async () => {
        try {
            const response = await getTopProduct();
            return response;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        }
    };

    const handleproductDetailsByID = async (id) => {
        try {
            const response = await productDetailsByID(id);

            setProduct(response.productDetails);
            return response.productDetails;

        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        }
    };


    const handleDeleteProductById = async (id) => {
        try {
            const response = await deleteProductById(id);

            return response

        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        }
    }

    const handleExpiringNotification = async () => {
        try {
            const response = await expiringNotification();

            return response

        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        }
    }

    const value = {
        loading,
        error,
        product,
        handleAddProducts,
        handleSubmitDetails,
        handleDetailsByQuery,
        handleGetTopProduct,
        handleproductDetailsByID,
        handleDeleteProductById,
        handleExpiringNotification
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
