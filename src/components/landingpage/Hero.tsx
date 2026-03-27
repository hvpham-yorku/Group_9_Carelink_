import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <section
            className="Hero"
            data-testid="hero-section"
            style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 55%, #f8fafc 100%)'
            }}
        >
            <div className="container row align-items-center mx-5 px-5">
                <div className="Container1 col-6">
                    <h1 className="fw-bold">
                        Home Care Coordination, <span className="text-primary">Simplified</span>
                    </h1>
                    <h5 className="text-secondary fw-light mt-3">
                        CareLink centralizes daily care tasks, medications, appointments, 
                        and shift handoff notes into a single shared system—built specifically 
                        for home healthcare teams.
                    </h5>

                    <div className="buttons d-flex gap-3 justify-content-start mt-4">
                        <Link to="/login" className="text-decoration-none">
                            <button className="btn btn-primary btn-lg px-4">
                                Get Started
                            </button>
                        </Link>
                        <a
                            href="#about"
                            className="btn btn-outline-primary border border-2 border-primary btn-lg px-4"
                        >
                            Learn More
                        </a>
                    </div>
                </div>

                <div className="Container2 col-6">
                    <img
                        src="https://images.unsplash.com/photo-1676281050264-178eff38874a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMGhvbWUlMjBjYXJlfGVufDF8fHx8MTc2OTIxMTY0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Home healthcare nurse assisting a patient at home"
                        className="rounded-2xl shadow-2xl w-75 shadow rounded-3 m-5"
                    />
                </div>
            </div>
        </section>
    );
}