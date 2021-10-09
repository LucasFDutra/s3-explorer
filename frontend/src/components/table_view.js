import FolderIcon from "./folder_icon"
import FileIcon from "./file_icon"

function TableView({content, end_of_page_id, download_object, get_object_list}){
    return (
        <table className="table" style={{"width": "100%", "maxWidth": "100%", "minWidth": "100%", "tableLayout": "fixed"}}>
            <thead>
                <tr>
                    <th width="2em" className="text-white" scope="col"></th>
                    <th width="30%" className="text-white table-content" scope="col">Nome</th>
                    <th width="10%" className="text-white table-content" scope="col">Size</th>
                    <th width="20%" className="text-white table-content" scope="col">Data De Modificação</th>
                    <th width="40%" className="text-white table-content" scope="col">Key</th>
                </tr>
            </thead>
            <tbody>
            {
                content.map(function(e,i){
                    return(
                        function(){
                            if(e.is_folder){
                                return (
                                    <FolderIcon folder_name={e.name} get_object_list={get_object_list} key={i} is_list_format={true}/>
                                )
                            } else{
                                return (
                                    <FileIcon 
                                        idName={i+1 === content.length ? end_of_page_id : null}
                                        file_name={e.name} 
                                        file_key={e.key} 
                                        file_size={e.size}
                                        file_last_modified={e.last_modified}
                                        download_object={download_object} 
                                        is_list_format={true}
                                        key={e.key}
                                    />
                                )
                            }
                        }()
                    )
                })
            }
            </tbody>
        </table>
    )
}

export default TableView