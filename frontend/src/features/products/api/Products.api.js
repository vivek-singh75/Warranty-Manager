import apiClient from "../../../services/apiClient";

export const addProducts = async (data) => {
    const response = await apiClient.post("/products/add", data);

    return response.data
}