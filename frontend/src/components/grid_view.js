import FolderIcon from "./folder_icon"
import FileIcon from "./file_icon"

function GridView({content, end_of_page_id, download_object, get_object_list}){
    return (
        <div className="p-2 ps-4 d-flex align-content-start flex-wrap">
        {
            function(){
                return content.map(function(e, i){
                    return(
                        function(){
                            if(e.is_folder){
                                return (
                                    <FolderIcon folder_name={e.name} get_object_list={get_object_list} key={i}/>
                                )
                            } else {
                                return (
                                    <FileIcon 
                                        idName={i+1 === content.length ? end_of_page_id : null}
                                        file_name={e.name} 
                                        file_key={e.key} 
                                        file_size={e.size}
                                        file_last_modified={e.last_modified}
                                        download_object={download_object} 
                                        key={e.key}
                                    />
                                )
                            }
                        }()
                    )
                })
            }()
        }
        </div>
    )
}

export default GridView