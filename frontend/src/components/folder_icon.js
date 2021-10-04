import FolderIconSvg from '../icons/folder.svg'

function FolderIcon({folder_name, get_object_list, is_list_format}){
    const prefix = `${folder_name}/`
    if (!is_list_format){
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
    } else {
        return (
            <tr onDoubleClick={()=>{get_object_list(prefix)}}>
                <th scope="row"><img src={FolderIconSvg} className="my-board-component-img-list" alt=''/></th>
                <td className="text-white file-name-list file-list">{folder_name}</td>
                <td className="text-white file-list"></td>
                <td className="text-white file-list"></td>
                <td className="text-white file-list"></td>
            </tr>
        )
    }
}

export default FolderIcon