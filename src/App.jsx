import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/login";
import Layout from "./components/layout";
import Users from "./pages/users";
import AdminProfile from "./pages/profile";
import Dashboard from "./pages/dashboard";
import CreateLocation from "./pages/create-location";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // что бы не отправляла на пустую страницу и url 
  useEffect(() => {
    if (window.location.pathname == "/") {
      navigate("/dashboard");
    }
  }, [window.location.pathname]);

  return (
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/" element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-profile" element={<AdminProfile />} />
        <Route path="/users" element={<Users />} />
        <Route path="/create-location" element={<CreateLocation />} />
      </Route>
    </Routes>
  );
}

// 6 серия 7:35
export default App;
