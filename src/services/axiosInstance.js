import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
             || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosInstance.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.response.use(
    (response)=>{
        return response;
    },
    (error)=>{
        if(error.response && error.response.status === 401){
            console.log('Session expired. Please login again.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        if(error.response && error.response.status === 403){
            console.log('Access denied');
        }
        if(error.response && error.response.status === 500){
            console.log('Server error. Please try again later.');
        }
        return Promise.reject(error);
    }
)
export default axiosInstance;
