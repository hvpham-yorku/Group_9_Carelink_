import { useNavigate } from "react-router-dom";
import Header from "../components/landingpage/Header";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <>
    <Header />
    </>
  );
};

export default LandingPage;