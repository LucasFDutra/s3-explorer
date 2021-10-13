import { useEffect, useState, useContext } from 'react'
import Spinner from '../components/spinner'
import TableView from '../components/table_view'
import GridView from '../components/grid_view'
import {AppContext} from '../utils/contexts'


function FilesBoard({get_object_list, search_objects, download_object}){
    const [search_term, set_search_term] = useState('')
    const {files_board_content, files_board_search_content, is_empty, is_loading, is_searching, is_table_view, is_loading_more} = useContext(AppContext)

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
    }, [is_loading, files_board_content, is_table_view])

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
    }, [is_loading, files_board_search_content])

    return (
        <div id="files-board">
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
                                                className="mx-4 mt-3 border-0 rounded text-white rounded bg-dark" 
                                                autoFocus 
                                                value={search_term}
                                                onChange={(event) => set_search_term(event.target.value)}
                                            />
                                        )
                                    }()
                                }
                                {
                                    function(){
                                        if (files_board_search_content.length > 0){
                                            return (
                                                <TableView content={files_board_search_content} end_of_page_id="end_of_page_search" download_object={download_object}/>
                                            )
                                        }
                                    }()
                                }
                            </>
                        )
                    } else {
                        if(is_table_view){
                            return (
                                <TableView content={files_board_content} end_of_page_id="end_of_page" download_object={download_object} get_object_list={get_object_list} />
                            )
                        } else {
                            return (
                                <GridView content={files_board_content} end_of_page_id="end_of_page" download_object={download_object} get_object_list={get_object_list} />
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
