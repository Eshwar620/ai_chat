import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ChatPage from "./pages/ChatPage";

function App() {
  const [token, setToken] = useState(null);

  // ✅ Load token on refresh
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={token ? <Navigate to="/chat" /> : <Login setToken={setToken} />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={token ? <Navigate to="/chat" /> : <Register />}
        />

        {/* CHAT */}
        <Route
          path="/chat"
          element={token ? <ChatPage /> : <Navigate to="/" />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;