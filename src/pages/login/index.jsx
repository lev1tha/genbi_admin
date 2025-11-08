import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { $API } from "../../axios";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const onClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    $API
      .post("/auth/login", formData)
      .then((response) => {
        const { token, refreshToken } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        window.location.href = "/login";
      })
      .catch((error) => {
        setErrorMessage(error.data?.message || "Ошибка при входе");
      });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-lg mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">Админ-панель</h1>
          <p className="text-gray-500 mt-1">Войдите для продолжения</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Login Input */}
            <div>
              <label
                htmlFor="login"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Логин
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="login"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  placeholder="Введите логин"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition outline-none text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Введите пароль"
                  className="block w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition outline-none text-gray-900"
                  required
                />
                <button
                  type="button"
                  onClick={onClickShowPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errorMessage && (
                <div className="mt-2 text-sm text-red-600">{errorMessage}</div>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Запомнить меня
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-slate-600 hover:text-slate-800 font-medium"
              >
                Забыли пароль?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-slate-700 hover:bg-slate-800 text-white py-2.5 rounded-md font-medium transition duration-150 shadow-sm"
            >
              Войти
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © PROlab Agency 2025 Все права защищены
        </p>
      </div>
    </div>
  );
}
