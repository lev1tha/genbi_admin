import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/login";
import Layout from "./components/layout";
import Users from "./pages/users";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/" element={<Layout />}>
        <Route path="/users" element={<Users />} />
      </Route>
    </Routes>
  );
}

// 6 серия 7:35
export default App;
