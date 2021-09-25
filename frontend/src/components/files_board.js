import FolderIcon from './folder_icon'
import FileIcon from './file_icon'
import Spinner from './spinner'

function FilesBoard({content, get_objects, download_object, is_empty, is_loading}){
    return (
        <div className="p-2 ps-4 d-flex align-content-start flex-wrap" id="files-board">
                {
                    function(){

                        if (is_loading){
                            return (
                                <Spinner />
                            )
                        }
                        else if (is_empty){
                            return(
                                <h3 id='is_empty' className="text-center">Bucket Vazio</h3>
                            )
                        } else {
                            return content.map(function(e, i){
                                return(
                                    function(){
                                        if(e.is_folder){
                                            return (
                                                <FolderIcon folder_name={e.name} get_objects={get_objects} key={i}/>
                                            )
                                        } else {
                                            return (
                                                <FileIcon file_name={e.name} file_key={e.key} download_object={download_object} key={e.key}/>
                                            )
                                        }
                                    }()
                                )
                            })
                        }
                    }()
                }
        </div>
    )
}

export default FilesBoard
