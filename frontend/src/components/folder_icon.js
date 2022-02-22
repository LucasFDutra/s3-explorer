import FolderIconSvg from '../icons/folder.svg'

function FolderIcon({folder_name, get_object_list, is_table_format}){
    if (is_table_format){
        return (
            <tr onDoubleClick={()=>{get_object_list(`${folder_name}/`)}}>
                <th scope="row"><img src={FolderIconSvg} alt='' style={{"width": "1.5em"}}/></th>
                <td className="text-white files-board-content" style={{"paddingLeft": "1.5em"}}>{folder_name}</td>
                <td className="text-white"></td>
                <td className="text-white"></td>
                <td className="text-white"></td>
            </tr>
        )
    } else {
        return (
            <div className="me-2 d-flex flex-column align-items-center justify-content-center board-component">
                <img src={FolderIconSvg} onDoubleClick={()=>{get_object_list(`${folder_name}/`)}} style={{"width": "67px"}} alt=''/>
                <span 
                    className="text-white text-center files-board-content" 
                    style={{width: "8rem"}} 
                >
                    {folder_name}
                </span>
            </div>
        )
    }
}

export default FolderIcon