import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import $API from "../../axios";

export default function Categories() {
  const [dataCategory, setDataCategory] = useState([]);
  const [loading, setLoaging] = useState(false);

  useEffect(() => {
    $API.get("/catalog/categories/").then((response) => { 
        console.log(response.data)
    });
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Управление категориями
        </h1>
        <p className="text-gray-600">
          Создавайте и редактируйте категории товаров
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Поиск по названию или slug..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
            </select>

            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Добавить категорию</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        {/* Parent Category Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-start gap-4">
              {/* Category Image */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                  <span className="text-gray-400">IMG</span>
                </div>
              </div>

              {/* Category Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Название категории
                      </h3>

                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Активна
                      </span>

                      <button className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition">
                        0 подкатегорий
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="inline-flex items-center">
                        <span className="font-semibold text-gray-700">0</span>
                        <span className="ml-1">товаров</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Edit />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                      <MoreVertical />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subcategories (static example) */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-gray-400">›</span>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Подкатегория
                    </h4>
                    <p className="text-xs text-gray-500">
                      Slug: <span className="font-mono">subcategory-slug</span>{" "}
                      • 0 товаров
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                    Активна
                  </span>
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                    <Edit />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition">
                    <Trash2 />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-4"></div>
    </div>
  );
}
