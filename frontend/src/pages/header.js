function Header(){
    return (
        <nav className="navbar sticky-top navbar-expand-lg bg-dark navbar-dark" style={{height: '9vh'}}>
            <div className="ms-4 d-flex align-items-center w-100">
                <div className="buttons d-flex">
                    <button className="btn btn-outline-secondary" style={{borderRadius: '5px 0 0 5px'}}>
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button className="btn btn-outline-secondary" style={{borderRadius: '0 5px 5px 0'}}>
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
                <div className="ms-4 border border-1 border-secondary rounded bg-secondary" style={{width: '-webkit-fill-available'}}>
                    <h6 className="m-2 text-white">user/teste/teste/teste</h6>
                </div>
            </div>
        </nav>
    )
}

export default Header