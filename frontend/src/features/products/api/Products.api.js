import apiClient from "../../../services/apiClient";


import { getChatSessionId } from "../../../services/ChatSession";

export const addProducts = async (message) => {
    try {
        const response = await apiClient.post(
            "/products/add",
            { userQuery: message },
            {
                headers: {
                    "x-chat-session-id": getChatSessionId()
                }
            }
        );
 
        return response.data;
    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        throw error;
    }
};

export const submitProducts = async (productData) => {
    try {
        const response = await apiClient.post("/products/submit", {
            productName: productData.productName,
            brand: productData.brand,
            category: productData.category,
            purchaseDate: productData.purchaseDate,
            purchasePrice: productData.purchasePrice,
            warranty: [
                {
                    durationMonths: productData.warranty[0].durationMonths,
                    startDate: productData.warranty[0].startDate,
                    expiryDate: productData.warranty[0].expiryDate,
                    type: productData.warranty[0].type
                }
            ]
        },  
        {
            headers: {
                "x-chat-session-id": getChatSessionId()
            }
        });

        return response.data;

    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        throw error;
    }
};

export const detailsByQuery = async (userQuery) => {
    try {
        const response = await apiClient.post("/products/listproducts", {
            userQuery: userQuery
        },
        {
            headers: {
                "x-chat-session-id": getChatSessionId()
            }
        }
    );

        return response.data;

    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        throw error;
    }
};

export const getTopProduct = async () => {
    try {
        const response = await apiClient.get("/products/topProducts");

        return response.data;

    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        throw error;
    }
};

export const productDetailsByID = async (id) => {
    try {
        const response = await apiClient.get(`/products/productDetails/${id}`);

        return response.data;

    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        throw error;
    }
};

export const deleteProductById = async (id) => {

    try {
        const response = await apiClient.delete(`/products/delete/${id}`);

        return response.data;

    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        throw error;
    }
}


export const expiringNotification = async () => {
    try {
        const response = await apiClient.get("/products/notification");

        return response.data;
    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        throw error;
    }
}