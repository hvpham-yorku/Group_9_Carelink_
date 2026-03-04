
export default function Hero() {
    return (
    <>
    <section className="Hero bg-primary-subtle d-flex flex-row">
        <div className="Container1 d-flex flex-column justify-content-center mx-5">
        <h1 className="Heading1p1 text-dark fw-bold" >
        Home Care Coordination,
        </h1>
        <h1 className="Heading1p2 text-primary fw-bold">
        Simplified
        </h1>
        <h5 className="text-secondary fw-light">
        CareLink centralizes daily care tasks, medications, 
        appointments, and shift handoff notes into a single 
        shared system—built specifically for home healthcare teams.
        </h5>
        <div className="buttons d-flex gap-3 justify-content-start mt-4">
            <button className="btn btn-primary btn-lg">
            Create an Account
            </button>
            <button className="btn btn-outline-primary btn-lg">
            Learn More
            </button>
        </div>
        
        </div>
        <div className="Container2 mx-5">
            <img src="https://images.unsplash.com/photo-1676281050264-178eff38874a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMGhvbWUlMjBjYXJlfGVufDF8fHx8MTc2OTIxMTY0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                className="rounded-2xl shadow-2xl w-75 shadow rounded-3 m-5"
            />
        </div>
    </section> 
    </>
    )
}