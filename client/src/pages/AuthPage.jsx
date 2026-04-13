import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = (token) => {
    localStorage.setItem("token", token);
    navigate("/chat");
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {isLogin ? (
            <Login setToken={handleAuth} />
        ) : (
            <Register setIsLogin={setIsLogin} />
            )}

        <p>
          {isLogin ? "Don't have account?" : "Already have account?"}
          <span onClick={() => setIsLogin(!isLogin)} style={styles.link}>
            {isLogin ? " Register" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#020617",
    color: "white",
  },
  box: {
    padding: "30px",
    background: "#111827",
    borderRadius: "10px",
    width: "300px",
  },
  link: {
    color: "#3b82f6",
    cursor: "pointer",
    marginLeft: "5px",
  },
};

export default AuthPage;