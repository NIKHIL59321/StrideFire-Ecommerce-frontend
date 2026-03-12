import axiosInstance from "./axiosInstance";

export const register = async (userData) =>{
    try{
        const response = await axiosInstance.post('/api/auth/register', userData);
        return response.data;
    }catch(error){
        throw error.response?.data || error.message
    }
}

export const login = async(email, password)=>{
    try{
        const response = await axiosInstance.post('/api/auth/login', {email, password})
        return response.data;
    }catch(error){
        throw error.response?.data || error.message
    }
}