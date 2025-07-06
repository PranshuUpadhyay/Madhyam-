import axios from 'axios';


export const baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
baseURL,
headers: {
'Content-Type': 'application/json'
}
});

export default axiosInstance;