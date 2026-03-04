import { useNavigate } from "react-router-dom";
import Header from "../components/landingpage/Header";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <>
    <Header />
    <div className="Hero bg-primary-subtle">
       div
    </div>
    </>
  );
};

export default LandingPage;