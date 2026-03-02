import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <>
    <button
      className="btn btn-primary mt-5"
      onClick={() => navigate("/Login")}
    >
    </button>
    </>
  );
};

export default LandingPage;