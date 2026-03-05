import { useNavigate } from "react-router-dom";
import LoginText from "../components/login/LoginText";
import LoginTextBox from "../components/login/LoginTextBox";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
    background: 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)'}}>
      <div className="container vh-100 d-flex justify-content-center align-items-center">
        <div className="col-md-6 col-lg-4 d-flex flex-column gap-3 p-4 shadow rounded">
          <LoginText />
          <LoginTextBox
            name="username"
            id="username"
            placeholder="Enter username"
          />
          <LoginTextBox
            name="password"
            id="password"
            placeholder="Enter password"
          />
          <button
            className="btn btn-primary mt-5"
            onClick={() => navigate("/dashboard")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
