import { useNavigate } from "react-router-dom";
import LoginText from "/Users/aa/Desktop/Git Repos/CareLink_Adeena/src/components/login/LoginText.tsx";
import LoginTextBox from "/Users/aa/Desktop/Git Repos/CareLink_Adeena/src/components/login/LoginTextBox.tsx";

const Login = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="d-flex justify-content-center">
       <LoginText/>
       <LoginTextBox name="username" id="username" />
       <LoginTextBox name="password" id="password" />
        <button
          className="btn btn-primary mt-5"
          onClick={() => navigate("/dashboard")}
        >
          Login
        </button>
      </div>
    </>
  );
};

export default Login;
