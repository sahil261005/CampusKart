import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401s (Refresh Token Logic could go here)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If 401 Unauthorized and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    throw new Error("No refresh token");
                }
                
                // Call refresh endpoint
                const resp = await axios.post('http://localhost:8000/api/token/refresh/', {
                    refresh: refreshToken
                });

                if (resp.status === 200) {
                     localStorage.setItem('access_token', resp.data.access);
                     api.defaults.headers.common['Authorization'] = `Bearer ${resp.data.access}`;
                     return api(originalRequest);
                }
            } catch (refreshError) {
                // Logout if refresh fails
                console.log("Session expired", refreshError);
                localStorage.clear();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
