import { createContext, useState } from "react";

import { addProducts , submitProducts} from "../api/Products.api";

export const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);

    const handleAddProducts = async (message) => {
        
        const response = await addProducts(message);

        return response;
    };

    const handleSubmitDetails = async (productData) => {
        const response = await submitProducts(productData);

        return response
    }

    const value = {
        loading,
        handleAddProducts,
        handleSubmitDetails
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};