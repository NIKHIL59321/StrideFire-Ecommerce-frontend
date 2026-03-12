import axiosInstance from "./axiosInstance";

export const createPaymentIntent = async (paymentData) =>{
    try{
        const response = await axiosInstance.post('/api/payments/create-intent', {
            orderId : paymentData.orderId,
            userId : paymentData.userId,
            paymentMethod : paymentData.paymentMethod,
            upiId : paymentData.upiId,
            currency : paymentData.currency

        });
        return response.data;
    } catch(error){
        throw error.response?.data || error.message
    }
}

export const confirmPayment = async (transactionId)=>{
    try{
        const response = await axiosInstance.post(`/api/payments/confirm?transactionId=${transactionId}`)
        return response.data;
    }catch(error){
        throw error.response?.data||error.message
    }
}

export const getPaymentByOrderId = async(orderId)=>{
    try{
        const response = await axiosInstance.get(`/api/payments/order/${orderId}`);
        return response.data;

    }catch(error){
        throw error.response?.data || error.message
    }
}