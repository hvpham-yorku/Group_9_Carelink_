
export default function Section5() {
    return (
        <section id="who-its-for" className="container my-5 py-5">
            <div className="row justify-content-center text-center mb-5">
                <div className="col-lg-8">
                    <h2 className="fw-bold mb-3">Who CareLink Is For</h2>
                    <p className="text-secondary fw-light fs-5">
                        Designed for everyone involved in coordinating home healthcare
                    </p>
                </div>
            </div>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                
                <div className="col">
                    <div className="card h-100 p-4 border bg-light shadow-sm">
                        <h5 className="fw-bold text-dark">Home-Care Nurses</h5>
                        <p className="text-secondary small mb-0">
                            Manage patient care plans, medications, and coordinate with other caregivers
                        </p>
                    </div>
                </div>

                <div className="col">
                    <div className="card h-100 p-4 border bg-light shadow-sm">
                        <h5 className="fw-bold text-dark">Personal Support Workers (PSWs)</h5>
                        <p className="text-secondary small mb-0">
                            Track daily tasks, document care provided, and communicate with team members
                        </p>
                    </div>
                </div>

                <div className="col">
                    <div className="card h-100 p-4 border bg-light shadow-sm">
                        <h5 className="fw-bold text-dark">Professional Caregiving Agencies</h5>
                        <p className="text-secondary small mb-0">
                            Coordinate multiple caregivers across different patients and locations
                        </p>
                    </div>
                </div>

                <div className="col">
                    <div className="card h-100 p-4 border bg-light shadow-sm">
                        <h5 className="fw-bold text-dark">Family Caregivers</h5>
                        <p className="text-secondary small mb-0">
                            Stay informed about care routines and communicate with professional caregivers
                        </p>
                    </div>
                </div>

                <div className="col">
                    <div className="card h-100 p-4 border bg-light shadow-sm">
                        <h5 className="fw-bold text-dark">Care Supervisors & Nurse Managers</h5>
                        <p className="text-secondary small mb-0">
                            Oversee care quality and ensure proper handoffs between shifts
                        </p>
                    </div>
                </div>

                <div className="col">
                    <div className="card h-100 p-4 border bg-light shadow-sm">
                        <h5 className="fw-bold text-dark">Small to Mid-Sized Organizations</h5>
                        <p className="text-secondary small mb-0">
                            Streamline operations without enterprise-level complexity and cost
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}