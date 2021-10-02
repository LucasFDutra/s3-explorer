import { useEffect } from 'react'
import FolderIcon from './folder_icon'
import FileIcon from './file_icon'
import Spinner from './spinner'

function FilesBoard({content, get_object_list, download_object, is_empty, is_loading}){
    useEffect(function() {
        if (document.getElementById('end_of_page')){
            const intersection_observer_end_of_page = new IntersectionObserver(function(entries){
                if (entries.some(entry => entry.isIntersecting)){
                    get_object_list('', false, true)
                }
            })
            intersection_observer_end_of_page.observe(document.getElementById('end_of_page'))
            return () => intersection_observer_end_of_page.disconnect();
        }
    }, [is_loading, content])

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
                                            <FolderIcon folder_name={e.name} get_object_list={get_object_list} key={i}/>
                                        )
                                    } else if (content.length === i+1){
                                        return (
                                            <FileIcon idName="end_of_page" file_name={e.name} file_key={e.key} download_object={download_object} key={e.key}/>
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
