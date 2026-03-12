import axiosInstance from "./axiosInstance"

export const getAllProducts = async ()=>{
    try{
        const response = await axiosInstance.get('/api/products');
        const data = response.data;
        return Array.isArray(data) ? data : data.products || [];
    }catch(error){
        throw error.response?.data || error.message
    }
}
export const getProductById = async (id)=>{
    try{
        const response = await axiosInstance.get(`/api/products/${id}`);
        const data = response.data;
        return Array.isArray(data) ? data[0] : data;
    }catch(error){
        throw error.response?.data || error.message
    }
}