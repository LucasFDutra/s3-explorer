import { useState, useEffect } from 'react'
import {api} from '../utils/api'
import Header from '../components/header'
import BucketSelector from '../components/bucket_selector'
import FilesBoard from '../components/files_board'
import toast_control from '../utils/toast_control'

function Main() {
    const [files_board_content, set_files_board_content] = useState([])
    const [buckets_list, set_buckets_list] = useState([])
    const [current_prefix, set_current_prefix] = useState('')
    const [previus_prefix, set_previus_prefix] = useState('')
    const [current_bucket, set_current_bucket] = useState('')
    const [is_empty, set_is_empty] = useState(false)
    const [is_loading, set_is_loading] = useState(false)
    const [next_continuation_token, set_next_continuation_token] = useState(false)

    useEffect(function(){
        get_buckets()
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
            toast_control(error.response.data)
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
            }
            
            const headers = {
                "x-bucket": current_bucket,
                "x-prefix": new_prefix
            }
            if (is_loading_more){
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
            toast_control(error.response.data)
        } finally {
            set_is_loading(false)
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
            toast_control(error.response.data)
        }
    }

    return (
        <>
            <Header current_folder={current_prefix} previus_folder={previus_prefix} get_object_list={get_object_list}/>
            <main>
                <BucketSelector buckets_list={buckets_list} set_current_bucket={set_current_bucket} is_loading={is_loading}/>
                <FilesBoard 
                    content={files_board_content} 
                    get_object_list={get_object_list} 
                    download_object={download_object} 
                    is_empty={is_empty} 
                    is_loading={is_loading}
                />
            </main>
        </>
    );
}

export default Main;
