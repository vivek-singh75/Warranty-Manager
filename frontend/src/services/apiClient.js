import axios from "axios";

const apiClient = axios.create({
    baseURL: 'https://warranty-manager-main.onrender.com/api',
    //baseURL: 'http://localhost:3000/api',
    withCredentials: true,
});

export default apiClient;