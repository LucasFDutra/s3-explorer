import FolderIconSvg from '../icons/folder.svg'

function FolderIcon({folder_name, get_object_list}){
    const prefix = `${folder_name}/`
    return (
        <div className="me-2 d-flex flex-column align-items-center justify-content-center my-board-component">
            <img src={FolderIconSvg} onDoubleClick={()=>{get_object_list(prefix)}} className="my-board-component-img" alt=''/>
            <span 
                className="text-white text-center" 
                style={{width: "8rem", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}} 
                title={folder_name.length > 13 ? folder_name : null}>
                    {folder_name}
            </span>
        </div>
    )
}

export default FolderIcon