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

$API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
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
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

$API.interceptors.response.use(
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

        console.log("Attempting to refresh token...");

        const refreshResponse = await axios.post(
          `${PUBLIC_BASE_URL}auth/refresh`,
          {
            refresh_token: refreshToken,
          }
        );

        console.log("Refresh response:", refreshResponse.data);

        const newToken =
          refreshResponse.data?.acces_token ||
          refreshResponse.data?.access_token;
        const newRefreshToken = refreshResponse.data?.refresh_token;

        if (newToken) {
          localStorage.setItem("token", newToken);
          console.log("New token saved");

          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
            console.log("New refresh token saved");
          }

          originalRequest.headers.Authorization = `Token ${newToken}`;
          return $API(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        console.error("Refresh error response:", refreshError.response?.data);

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

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
          {
            refresh_token: refreshToken,
          }
        );

        const newToken =
          refreshResponse.data?.acces_token ||
          refreshResponse.data?.access_token;
        const newRefreshToken = refreshResponse.data?.refresh_token;

        if (newToken) {
          localStorage.setItem("token", newToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          originalRequest.headers.Authorization = `Token ${newToken}`;
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
