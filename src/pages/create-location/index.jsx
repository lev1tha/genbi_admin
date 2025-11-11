import { useState, useEffect } from "react";
import {
  MoreVertical,
  Edit,
  Trash2,
  LocateIcon,
  Phone,
  Search,
  Download,
  Plus,
} from "lucide-react";
import $API from "../../axios";

export default function CreateLocation() {
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    $API.get("/geo/countries/").then(({ data }) => {
      setLocations(data);
      setIsLoading(false);
    });
  }, []);

  const filteredLocations = locations
    .filter((location) =>
      location.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((location) => {
      if (statusFilter === "all") return true;
      return statusFilter === "active"
        ? location.status || location.is_active
        : !location.status && !location.is_active;
    });

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "—";

  const getStatusBadge = (status) =>
    status ? (
      <span className="text-green-600">Активен</span>
    ) : (
      <span className="text-red-600">Неактивен</span>
    );

  const handleEditLocation = (locationId) => {
    console.log("Edit location with ID:", locationId);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Создание Туристических карточек
        </h1>
        <p className="text-gray-600">
          Место где вы создаете те или локации для отправки туристов
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Поиск по имени страны или локации..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
            </select>

            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Экспорт</span>
            </button>

            <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Добавить</span>
            </button>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {filteredLocations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Нет данных от сервера</p>
              <p className="text-xs text-gray-400 mt-2">
                Проверьте консоль для отладки
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Страна
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Локация
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Роль
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата регистрации
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLocations.map((location) => (
                  <tr key={location.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-medium">
                            {getInitials(
                              location.name ||
                                location.username ||
                                location.login
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {location.name ||
                              location.username ||
                              location.login ||
                              "Без имени"}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {location.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <LocateIcon className="w-4 h-4 mr-2 text-gray-400" />
                          {location.email || "Не указан"}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {location.phone || "Не указан"}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {location.role || location.role_name || "Пользователь"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(location.status || location.is_active)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {location.createdAt || location.created_at
                        ? new Date(
                            location.createdAt || location.created_at
                          ).toLocaleDateString("ru-RU")
                        : "—"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditLocation(location.id)}
                          className="p-2 text-gray-400 hover:text-slate-600 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-slate-600 hover:bg-gray-100 rounded-lg transition">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
