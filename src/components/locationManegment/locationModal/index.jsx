// LocationModal.jsx
import { useState } from "react";
import $API from "../../../axios";

export const LocationModal = ({
  show,
  type,
  activeTab,
  selectedItem,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: selectedItem?.name || "",
    alpha2_code: selectedItem?.alpha2_code || "",
    country_id: selectedItem?.region?.country?.id || "",
    region_id: selectedItem?.region?.id || "",
    population: selectedItem?.population || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!show) return null;

  const getEndpoint = () => {
    const endpoints = {
      countries: "geo/countries/",
      regions: "geo/regions/",
      cities: "geo/cities/",
    };
    return endpoints[activeTab];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;
      const endpoint = getEndpoint();

      if (type === "add") {
        response = await $API.post(endpoint, formData);
      } else {
        response = await $API.put(`${endpoint}${selectedItem.id}/`, formData);
      }

      console.log("Успешно")

      onSuccess(response.data, type);
      onClose();
    } catch (err) {
      console.error("Ошибка:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {type === "add" ? "Добавить" : "Редактировать"}{" "}
          {activeTab === "countries"
            ? "страну"
            : activeTab === "regions"
            ? "регион"
            : "город"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите название"
            />
          </div>

          {activeTab === "countries" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Код страны
              </label>
              <input
                type="text"
                name="alpha2_code"
                value={formData.alpha2_code}
                onChange={handleChange}
                required
                maxLength={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Например: KG"
              />
            </div>
          )}

          {activeTab === "regions" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Страна
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Выберите страну</option>
                <option>Кыргызстан</option>
                <option>Россия</option>
              </select>
            </div>
          )}

          {activeTab === "cities" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Регион
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Выберите регион</option>
                  <option>Чуйская область</option>
                  <option>Ошская область</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Население
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Например: 1.1M"
                />
              </div>
            </>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
