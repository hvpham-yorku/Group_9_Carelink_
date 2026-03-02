import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="logo-container">
        {/* Use the imported logo variable in the src attribute */}
        <h1>CareLink</h1>
      </div>
      <nav className="nav-links">
        {/* Use <a> tags for simple anchors or a routing library for navigation */}
        <a href="#home">Features</a>
        <a href="#about">Benefits</a>
        <a href="#contact">Who It's For</a>
        <button
        className="btn btn-outline-primary btn-lg mt-5"
        onClick={() => navigate("/login")}
        > Login
        </button>
      </nav>
    </header>
  );
}

