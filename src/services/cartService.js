import axiosInstance from "./axiosInstance";

export const addToCart = async (userId, productId, quantity) =>{
    try{
        const response = await axiosInstance.post('/api/cart/add', {
            userId, 
            productId, 
            quantity});
        return response.data;
    }catch(error){
        throw error.response?.data || error.message
    }
}
export const getCart = async (userId) =>{
    try{
        const response = await axiosInstance.get(`/api/cart/${userId}`);
        return response.data;
    }catch(error){
        throw error.response?.data || error.message
    }
}

export const updateQuantity = async (cartItemId, quantity) => {
    try{
        const response = await axiosInstance.put(`/api/cart/update/${cartItemId}`, {quantity});
        return response.data;
    }catch(error){
        throw error.response?.data || error.message
    }
}

export const removeItem = async (cartItemId)=>{
    try{
        const response = await axiosInstance.delete(`/api/cart/remove/${cartItemId}`);
        return response.data;
    }
    catch(error){
        throw error.response?.data || error.message
    }
}
export const clearCart = async (userId) =>{
    try{
        const response = await axiosInstance.delete(`/api/cart/clear/${userId}`);
        return response.data;
    }catch(error){
        throw error.response?.data || error.message
    }  
}