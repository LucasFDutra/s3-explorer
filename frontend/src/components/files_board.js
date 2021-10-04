import { useEffect, useState } from 'react'
import FolderIcon from './folder_icon'
import FileIcon from './file_icon'
import Spinner from './spinner'

function FilesBoard({content, search_content, get_object_list, download_object, is_empty, is_loading, is_loading_search, is_searching, search_objects}){
    const [search_term, set_search_term] = useState('')

    useEffect(function(){
        const search_delay = setTimeout(function(){
            search_objects(search_term)
        }, 1000);
        return () => clearTimeout(search_delay)
    }, [search_term])
    
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

    useEffect(function() {
        if (document.getElementById('end_of_page_search')){
            Array.from(document.getElementsByClassName('file-list')).forEach(function(e){
                if (e.offsetWidth < e.scrollWidth){
                    e.title = e.innerText
                }
            })

            const intersection_observer_end_of_page_search = new IntersectionObserver(function(entries){
                if (entries.some(entry => entry.isIntersecting)){
                    console.log(`quero mais ${search_term}`)
                    search_objects(search_term, true)
                }
            })
            intersection_observer_end_of_page_search.observe(document.getElementById('end_of_page_search'))
            return () => intersection_observer_end_of_page_search.disconnect();
        }
    }, [is_loading, search_content])

    return (
        <div className="p-2 ps-4 d-flex align-content-start flex-wrap" id="files-board">
            {
                function(){
                    if (is_loading){
                        return (
                            <Spinner idName="spinner"/>
                        )
                    }
                    else if (is_empty){
                        return(
                            <h3 id='is_empty' className="text-center">Bucket Vazio</h3>
                        )
                    } else if (is_searching){
                        return (
                            <>
                                {
                                    function() {
                                        return(   
                                            <input 
                                                id="search_bar" 
                                                className="border-0 rounded text-white rounded bg-dark" 
                                                autoFocus 
                                                value={search_term}
                                                onChange={(event) => set_search_term(event.target.value)}
                                            />
                                        )
                                    }()
                                }
                                {
                                    function(){
                                        if (search_content.length > 0){
                                            return (
                                                <>
                                                <table className="table" style={{"width": "100%", "maxWidth": "100%", "minWidth": "100%", "tableLayout": "fixed"}}>
                                                    <thead>
                                                        <tr>
                                                            <th width="2em" className="text-white" scope="col"></th>
                                                            <th width="30%" className="text-white file-list" scope="col">Nome</th>
                                                            <th width="10%" className="text-white file-list" scope="col">Size</th>
                                                            <th width="20%" className="text-white file-list" scope="col">Data De Modificação</th>
                                                            <th width="40%" className="text-white file-list" scope="col">Key</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        search_content.map(function(e,i){
                                                            return(
                                                                <FileIcon 
                                                                    idName={i+1 === search_content.length ? "end_of_page_search" : null}
                                                                    file_name={e.name} 
                                                                    file_key={e.key} 
                                                                    file_size={e.size}
                                                                    file_last_modified={e.last_modified}
                                                                    download_object={download_object} key={e.key}
                                                                    is_list_format={true}
                                                                    key={i}
                                                                />
                                                            )
                                                        })
                                                    }
                                                    </tbody>
                                                </table>
                                                {
                                                    function(){
                                                        if(is_loading_search){
                                                            return(
                                                                <Spinner idName="bottom-spinner"/>
                                                            )
                                                        }
                                                    }()
                                                }
                                                </>
                                            )
                                        }
                                    }()
                                }
                            </>
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
                                            <FileIcon 
                                                idName="end_of_page" 
                                                file_name={e.name} 
                                                file_key={e.key} 
                                                file_size={e.size}
                                                file_last_modified={e.last_modified}
                                                download_object={download_object} 
                                                key={e.key}
                                            />
                                        )
                                    } else {
                                        return (
                                            <FileIcon 
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
                    }
                }()
            }
        </div>
    )
}

export default FilesBoard
