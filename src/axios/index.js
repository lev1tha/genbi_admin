import axios from "axios";

const PUBLIC_BASE_URL = "https://genbi-back.prolabagency.com/";

const $API = axios.create({
  baseURL: PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const $APIFORMS = axios.create({
  baseURL: PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Request interceptor - добавляем токен к каждому запросу
$API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

$APIFORMS.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - обработка ошибок и обновление токена
$API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не повторный запрос
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Запрос на обновление токена
        const refreshResponse = await axios.post(
          `${PUBLIC_BASE_URL}auth/refresh`,
          { refreshToken }
        );

        const newToken = refreshResponse.data?.token;
        const newRefreshToken = refreshResponse.data?.refreshToken;

        if (newToken) {
          // Сохраняем новые токены
          localStorage.setItem("token", newToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          // Обновляем заголовок и повторяем оригинальный запрос
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return $API(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Очищаем токены и редиректим на логин
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        // Редирект на страницу логина
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

$APIFORMS.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const refreshResponse = await axios.post(
          `${PUBLIC_BASE_URL}auth/refresh`,
          { refreshToken }
        );

        const newToken = refreshResponse.data?.token;
        const newRefreshToken = refreshResponse.data?.refreshToken;

        if (newToken) {
          localStorage.setItem("token", newToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return $APIFORMS(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { $API, $APIFORMS };
export default $API;
