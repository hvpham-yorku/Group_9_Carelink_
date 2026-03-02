import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="header d-flex justify-content-between align-items-center px-4 py-2 border-bottom">
      <div className="logo-container">
        <h1 className="h3 mb-0">CareLink</h1>
      </div>

      <nav className="d-flex align-items-center">
        <div className="nav nav-pills me-3">
          <a className="nav-link" href="#home">Features</a>
          <a className="nav-link" href="#about">Benefits</a>
          <a className="nav-link" href="#contact">Who It's For</a>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </nav>
    </header>
  )
}

