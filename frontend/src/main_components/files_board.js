import { useEffect, useState } from 'react'
import FolderIcon from '../components/folder_icon'
import FileIcon from '../components/file_icon'
import Spinner from '../components/spinner'
import TableView from '../components/table_view'
import GridView from '../components/grid_view'

function FilesBoard({content, search_content, get_object_list, search_objects, download_object, is_empty, is_loading, is_loading_more, is_searching, is_table_view}){
    const [search_term, set_search_term] = useState('')

    useEffect(function(){
        const search_delay = setTimeout(function(){
            search_objects(search_term)
        }, 1000);
        return () => clearTimeout(search_delay)
    }, [search_term])
    
    useEffect(function() {
        if (document.getElementById('end_of_page')){
            if (is_table_view){
                Array.from(document.getElementsByClassName('file-list')).forEach(function(e){
                    if (e.offsetWidth < e.scrollWidth){
                        e.title = e.innerText
                    }
                })
            }

            const intersection_observer_end_of_page = new IntersectionObserver(function(entries){
                if (entries.some(entry => entry.isIntersecting)){
                    get_object_list('', false, true)
                }
            })
            intersection_observer_end_of_page.observe(document.getElementById('end_of_page'))
            return () => intersection_observer_end_of_page.disconnect();
        }
    }, [is_loading, content, is_table_view])

    useEffect(function() {
        if (document.getElementById('end_of_page_search')){
            Array.from(document.getElementsByClassName('table-content')).forEach(function(e){
                if (e.offsetWidth < e.scrollWidth){
                    e.title = e.innerText
                }
            })

            const intersection_observer_end_of_page_search = new IntersectionObserver(function(entries){
                if (entries.some(entry => entry.isIntersecting)){
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
                                                <TableView content={search_content} end_of_page_id="end_of_page_search" download_object={download_object}/>
                                            )
                                        }
                                    }()
                                }
                            </>
                        )
                    } else {
                        if(is_table_view){
                            return (
                                <TableView content={content} end_of_page_id="end_of_page" download_object={download_object} get_object_list={get_object_list} />
                            )
                        } else {
                            return (
                                <GridView content={content} end_of_page_id="end_of_page" download_object={download_object} get_object_list={get_object_list} />
                            )
                        }
                    }
                }()
            }
            {
                function(){
                    if(is_loading_more){
                        return(
                            <Spinner idName="bottom-spinner"/>
                        )
                    }
                }()
            }
        </div>
    )
}

export default FilesBoard
