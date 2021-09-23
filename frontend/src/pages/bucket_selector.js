function BucketSelector(){
    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{width: "280px"}}>
            <div className="d-flex align-items-center mb-3 ms-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4">Buckets</span>
            </div>
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <a href="#" className="nav-link active" aria-current="page">
                        bucket-1
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link text-white">
                        bucket-2
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link text-white">
                        bucket-3
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link text-white">
                        bucket-4
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default BucketSelector
