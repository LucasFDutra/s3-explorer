import { useState, useEffect } from 'react'
import { AppContext } from '../utils/contexts'
import {api} from '../utils/api'
import Header from '../main_components/header'
import BucketSelector from '../main_components/bucket_selector'
import FilesBoard from '../main_components/files_board'
import {show_toast} from '../components/toast'

function Main() {
    const [buckets_list, set_buckets_list] = useState([])
    const [files_board_content, set_files_board_content] = useState([])
    const [files_board_search_content, set_files_board_search_content] = useState([])

    const [current_prefix, set_current_prefix] = useState('')
    const [previus_prefix, set_previus_prefix] = useState('')
    const [current_bucket, set_current_bucket] = useState('')
    
    const [is_empty, set_is_empty] = useState(false)
    const [is_loading, set_is_loading] = useState(false)
    const [is_searching, set_is_searching] = useState(false)
    const [is_table_view, set_is_table_view] = useState(false)
    const [is_loading_more, set_is_loading_more] = useState(false)
    
    const [next_continuation_token, set_next_continuation_token] = useState(false)
    const [next_continuation_token_search, set_next_continuation_token_search] = useState(false)

    useEffect(function(){
        get_buckets()
        start_search_bar()
    }, [])

    useEffect(function() {
        if (!is_loading){
            set_files_board_content([])
            get_object_list('')
        }
    }, [current_bucket])

    async function get_buckets(){
        try {
            const response = await api.get('/get_buckets')
            set_buckets_list(response.data)
        } catch (error) {
            show_toast(error.response.data, 'error')
        }
    }

    function start_search_bar(){
        let ctrl = false;
        document.addEventListener("keydown", function(event){
            if(event.key === 'Control'){
                ctrl = true;
            }
            if(event.key.toLocaleLowerCase() === 'f' && ctrl === true){
                event.preventDefault();
                set_files_board_search_content([])
                set_next_continuation_token_search(false)
                set_is_searching((currentValue) => !currentValue)
            }
        }, true);

        document.addEventListener("keyup", function(event){
            if(event.key === 'Control'){
                ctrl = false;
            }
        });
    }

    async function search_objects(search_term, is_loading_more) {
        if ((search_term.length === 0) || (current_bucket === '')  || (is_loading_more && !next_continuation_token_search)){
            return
        }
        try{
            if (!is_loading_more){
                set_files_board_search_content([])
                set_is_loading(true)
            }

            const headers = {
                "x-bucket": current_bucket,
                "x-prefix": current_prefix,
                "x-search-term": search_term
            }
            if (is_loading_more){
                set_is_loading_more(true)
                headers['x-next-continuation-token'] = next_continuation_token_search
            }
            const config = {"headers": headers}
            const response = await api.get('/search_object', config)
            console.log(response)
            if (response.data.objects.length === 0){
                set_files_board_search_content([])
                set_next_continuation_token_search(false)
            } else {
                set_next_continuation_token_search(response.data.next_continuation_token)
                set_files_board_search_content((currentList) => [...currentList, ...response.data.objects])
            } 
        } catch (error) {
            show_toast(error.response.data, 'error')
        } finally {
            set_is_loading(false)
            set_is_loading_more(false)
        }
    }

    async function get_object_list(prefix, is_previus, is_loading_more){
        if ((current_bucket === '') || (is_previus && current_prefix === '') || (is_loading_more && !next_continuation_token)){
            return
        }
        
        try {
            let new_prefix = current_prefix
            let new_previus
            if (!is_loading_more){
                set_is_loading(true)
                if (prefix === ''){
                    new_prefix = ''
                    new_previus = ''
                } else if (is_previus){
                    new_prefix = previus_prefix
                    let split_prefix = new_prefix.split('/').slice(0, new_prefix.split('/').length-2)
                    new_previus = split_prefix.length === 0 ? '' : split_prefix.join('/')+'/'
                } else {
                    new_prefix = `${current_prefix}${prefix}`
                    new_previus = current_prefix
                }
                set_current_prefix(new_prefix)
                set_previus_prefix(new_previus)
                set_files_board_content(() => [])

                set_is_searching(false)
                set_files_board_search_content([])
                set_next_continuation_token_search(false)
            }
            
            const headers = {
                "x-bucket": current_bucket,
                "x-prefix": new_prefix
            }
            if (is_loading_more){
                set_is_loading_more(true)
                headers['x-next-continuation-token'] = next_continuation_token
            }
            const config = {"headers": headers}
            const response = await api.get('/get_object_list', config)
            if (response.data.objects.length === 0){
                set_files_board_content([])
                set_next_continuation_token(false)
                set_is_empty(true)
            } else {
                set_is_empty(false)
                set_next_continuation_token(response.data.next_continuation_token)
                set_files_board_content((currentList) => [...currentList, ...response.data.objects])
            }
        } catch (error) {
            show_toast(error.response.data, 'error')
        } finally {
            set_is_loading(false)
            set_is_loading_more(false)
        }
    }

    function download_file(file_name, file_url){
        const link = document.createElement('a');
        link.href = file_url;
        link.setAttribute('download', file_name);
        document.body.appendChild(link);
        link.click();
    }

    async function download_object(file_name, file_key){
        try{
            const header = {
                "headers": {
                    "x-bucket": current_bucket,
                    "x-key-name": file_key
                }
            }
            const response = await api.get('/download_object', header)
            download_file(file_name, response.data)
        } catch (error) {
            show_toast(error.response.data, 'error')
        }
    }


    return (
        <AppContext.Provider value={{
            buckets_list, files_board_content, 
            files_board_search_content, 
            current_prefix, previus_prefix, 
            set_current_bucket, is_empty, 
            is_loading, is_searching, 
            is_table_view, set_is_table_view, 
            is_loading_more
        }}>
            <Header get_object_list={get_object_list} />
            <main>
                <BucketSelector />
                <FilesBoard 
                    get_object_list={get_object_list} 
                    download_object={download_object} 
                    search_objects={search_objects}
                />
            </main>
        </AppContext.Provider>
    );
}

export default Main;
