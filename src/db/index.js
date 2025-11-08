import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  FileText,
  Bell,
} from "lucide-react";

export const $NavigateTo = [
  {
    name: "Дашборд",
    path: "/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    name: "Пользователи",
    path: "/users",
    icon: <Users />,
  },
  {
    name: "Аналитика",
    path: "/analytics",
    icon: <BarChart3 />,
    badge: "3",
  },
  {
    name: "Отчеты",
    path: "/reports",
    icon: <FileText />,
  },
  {
    name: "Уведомления",
    path: "/notifications",
    icon: <Bell />,
    badge: "12",
  },
  {
    name: "Настройки",
    path: "/settings",
    icon: <Settings />,
  },
];
