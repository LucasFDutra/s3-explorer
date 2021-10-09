function Header({current_folder, previus_folder, get_object_list, set_is_table_view, is_loading, is_loading_more}){
    function handle_back_folder(){
        if (!is_loading && !is_loading_more){
            console.log('aqiiiii')
            get_object_list(previus_folder, true)
        }
    }
    
    function handle_view_change(is_grid){
        if (is_grid){
            set_is_table_view(false)
            document.getElementById('grid-view-button').classList.add('btn-files-view-selected')
            document.getElementById('list-view-button').classList.remove('btn-files-view-selected')
        } else {
            set_is_table_view(true)
            document.getElementById('grid-view-button').classList.remove('btn-files-view-selected')
            document.getElementById('list-view-button').classList.add('btn-files-view-selected')
        }
    }

    return (
        <>
        <nav className="navbar sticky-top navbar-expand-lg bg-dark navbar-dark" style={{height: '9vh'}}>
            <div className="ms-4 me-2 d-flex align-items-center w-100">
                <button onClick={() => {handle_back_folder()}} className="btn btn-outline-secondary">
                    <i className="bi bi-chevron-left"></i>
                </button>
                <div className="mx-2 rounded" style={{height: '2.2em', width: '-webkit-fill-available', background: '#282c34ff'}}>
                    <h6 className="m-2 ms-3 text-white">{current_folder.slice(0,current_folder.length-1)}</h6>
                </div>
                <button id="grid-view-button" onClick={() => handle_view_change(true)} className="btn btn-outline-secondary text-white btn-files-view-selected" style={{borderRadius: "4px 0 0 4px"}}>
                    <i className="bi bi-grid-3x3-gap-fill"></i>
                </button>
                <button id="list-view-button" onClick={() => handle_view_change(false)} className="btn btn-outline-secondary btn-files-view text-white" style={{borderRadius: "0 4px 4px 0", borderLeft: 0}}>
                    <i className="bi bi-list-task"></i>
                </button>
            </div>
        </nav>
        </>
    )
}

export default Header