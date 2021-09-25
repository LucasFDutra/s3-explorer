function Header({current_folder, previus_folder, get_objects}){
    return (
        <nav className="navbar sticky-top navbar-expand-lg bg-dark navbar-dark" style={{height: '9vh'}}>
            <div className="ms-4 d-flex align-items-center w-100">
                <button onClick={() => {get_objects(previus_folder, true)}} className="btn btn-outline-secondary">
                    <i className="bi bi-chevron-left"></i>
                </button>
                <div className="mx-2 rounded" style={{height: '2.2em', width: '-webkit-fill-available', background: '#282c34ff'}}>
                    <h6 className="m-2 ms-3 text-white">{current_folder.slice(0,current_folder.length-1)}</h6>
                </div>
            </div>
        </nav>
    )
}

export default Header