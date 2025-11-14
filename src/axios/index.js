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

let refreshTokenTimer = null;

const setTokenRefreshTimer = () => {
  if (refreshTokenTimer) {
    clearTimeout(refreshTokenTimer);
  }

  const refreshTime = 25 * 60 * 1000;

  refreshTokenTimer = setTimeout(async () => {
    console.log("⏰ Автоматическое обновление токена...");
    await refreshAccessToken();
  }, refreshTime);

  console.log(`⏱️ Токен будет обновлен через ${refreshTime / 60000} минут`);
};

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    console.log("🔄 Обновление токена...");

    const refreshResponse = await axios.post(`${PUBLIC_BASE_URL}auth/refresh`, {
      refresh_token: refreshToken,
    });

    const newToken =
      refreshResponse.data?.access_token || refreshResponse.data?.acces_token;
    const newRefreshToken = refreshResponse.data?.refresh_token;

    if (newToken) {
      localStorage.setItem("token", newToken);
      console.log("✅ Новый access токен сохранен");

      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
        console.log("✅ Новый refresh токен сохранен");
      }

      setTokenRefreshTimer();

      return newToken;
    } else {
      throw new Error("No access token received");
    }
  } catch (error) {
    console.error("Ошибка обновления токена:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    clearTimeout(refreshTokenTimer);
    window.location.href = "/login";

    throw error;
  }
};

if (localStorage.getItem("token")) {
  setTokenRefreshTimer();
}

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

$API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("🔒 Получен 401, попытка обновить токен...");
        const newToken = await refreshAccessToken();

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return $API(originalRequest);
      } catch (refreshError) {
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
        console.log("🔒 Получен 401, попытка обновить токен...");
        const newToken = await refreshAccessToken();

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return $APIFORMS(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const startTokenRefresh = () => {
  setTokenRefreshTimer();
};

export const stopTokenRefresh = () => {
  if (refreshTokenTimer) {
    clearTimeout(refreshTokenTimer);
    refreshTokenTimer = null;
    console.log("⏹️ Таймер обновления токена остановлен");
  }
};

export { $API, $APIFORMS };
export default $API;
