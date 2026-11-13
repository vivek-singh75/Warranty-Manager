import apiClient from "../../../services/apiClient";

export const registerUser = async (data) => {
    try {
        const response = await apiClient.post("/auth/register", data);
        return response.data;

    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        throw error;
    }
};

export const loginUser = async (data) => {
    try {
        const response = await apiClient.post("/auth/login", data);
        return response.data;

    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await apiClient.get("/auth/getMe");
        return response.data;

    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const response = await apiClient.post("/auth/logout");
        return response.data;

    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        throw error;
    }
};