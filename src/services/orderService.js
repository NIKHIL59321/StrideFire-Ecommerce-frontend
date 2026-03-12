import axiosInstance from "./axiosInstance";

export const placeOrder = async(userId)=>{
    try{
        const response = await axiosInstance.post('/api/orders/place', {userId});
        return response.data;
    }
    catch(error){
        throw error.response?.data || error.message
    }
}

export const getOrders = async(userId, status=null)=>{
    try{
        const url = status
        ? `/api/orders/${userId}?status=${status}`
        : `/api/orders/${userId}`;
        const response = await axiosInstance.get(url);
        return response.data;
    } catch(error){
        throw error.response?.data || error.message;
    }
}

export const cancelOrder = async (
        orderId, userId) => {
    try {
        const response = await axiosInstance.put(
            `/api/orders/cancel/${orderId}`,
            { userId: Number(userId) }
        )
        return response.data
    } catch (error) {
        throw error.response?.data ||
              { error: 'Failed to cancel order' }
    }
}