import apiClient from "../../../services/apiClient";

export const addProducts = async (message) => {

    try {
        const response = await apiClient.post("/products/add",{
            userQuery :message
        } );
        console.log(response)

    return response.data;
    } catch (error) {
        console.log(error.message)
        throw error
    }

    
}

export const submitProducts = async (productData) => {
    
    const response = await apiClient.post("/products/submit" , {
        productName: productData.productName,
        brand: productData.brand,
        category: productData.category,
        purchaseDate: productData.purchaseDate ,
        purchasePrice: productData.purchasePrice,
        warranty: [
            {
            durationMonths: productData.warranty[0].durationMonths ,
            startDate: productData.warranty[0].startDate ,
            expiryDate: productData.warranty[0].expiryDate,
            type: productData.warranty[0].type
            }
        ]
    });

    return response.data;
}