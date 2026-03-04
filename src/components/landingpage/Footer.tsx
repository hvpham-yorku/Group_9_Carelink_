
export default function Footer() {
    return (
        <>
        <section className="Footer bg-dark d-flex justify-content-center pt-5">
        <div className="container" >
            <div className="row g-4 px-lg-5">
                <div className="col-lg-4 col-md-6">
                    <h5 className="text-white">CareLink</h5>
                    <h6 className="text-secondary fw-light">Simplifying home care coordination for better patient outcomes.</h6>
                </div>
                <div className="col-lg-2 col-md-6">
                    <h6 className="text-white">Product</h6>
                    <ul className="list-unstyled fw-normal">
                            <li><a href="#" className="text-secondary text-decoration-none">Features</a></li>
                            <li><a href="#" className="text-secondary text-decoration-none">Pricing</a></li>
                            <li><a href="#" className="text-secondary text-decoration-none">Demo</a></li>
                    </ul>
                </div>
                <div className="col-lg-2 col-md-6">
                    <h6 className="text-white">Company</h6>
                    <ul className="list-unstyled fw-normal">
                            <li><a href="#" className="text-secondary text-decoration-none">About</a></li>
                            <li><a href="#" className="text-secondary text-decoration-none">Contact</a></li>
                            <li><a href="#" className="text-secondary text-decoration-none">Privacy</a></li>
                    </ul>
                </div>
                <div className="col-lg-2 col-md-6">
                    <h6 className="text-white">Resources</h6>
                    <ul className="list-unstyled fw-normal">
                            <li><a href="#" className="text-secondary text-decoration-none">Documentation</a></li>
                            <li><a href="#" className="text-secondary text-decoration-none">Support</a></li>
                            <li><a href="#" className="text-secondary text-decoration-none">Blog</a></li>
                    </ul>
                </div>
            </div>
            <div className="border-top border-secondary mt-5 pt-4 text-center">
                    <p className="text-secondary small">© 2026 CareLink. All rights reserved.</p>
            </div>
        </div>
        </section>
        </>
    )
}