import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <>
    <button
      className="btn btn-outline-primary btn-lg mt-5"
      onClick={() => navigate("/Login")}
    > Login
    </button>
    </>
  );
};

export default LandingPage;