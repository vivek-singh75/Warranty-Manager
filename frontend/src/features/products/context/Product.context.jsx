import { createContext, useState } from "react";

import { addProducts , submitProducts , detailsByQuery, getTopProduct} from "../api/Products.api";

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

    const handleDetailsByQuery = async (userQuery)=>{
        const response = await detailsByQuery(userQuery);

        return response
    }

    const handleGetTopProduct = async ()=>{
        const response = await getTopProduct();

        return response
    }


    const value = {
        loading,
        handleAddProducts,
        handleSubmitDetails,
        handleDetailsByQuery,
        handleGetTopProduct
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};