import { Children, createContext, useEffect, useState } from "react";

import { addProducts } from "../api/Products.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) =>{
    const [loading, setLoading] = useState(false);

    const handleAddProducts = async (data)=>{

        const response = await addProducts(data);

        return response;
    }


    const value = {
        loading,

        handleAddProducts
    }

    return (
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
        );
}