import axiosInstance from "./axiosInstance"

export const getAllProducts = async ()=>{
    try{
        const response = await axiosInstance.get('/api/products');
        return response.data;
    }catch(error){
        throw error.response?.data || error.message
    }
}
export const getProductById = async (id)=>{
    try{
        const response = await axiosInstance.get(`/api/products/${id}`);
        return response.data;
    }catch(error){
        throw error.response?.data || error.message
    }
}