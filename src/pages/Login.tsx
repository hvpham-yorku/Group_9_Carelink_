import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="d-flex justify-content-center">
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
