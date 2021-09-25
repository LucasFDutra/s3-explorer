import { useState, useEffect } from 'react'
import {api} from '../utils/api'
import Header from '../components/header'
import BucketSelector from '../components/bucket_selector'
import FilesBoard from '../components/files_board'

function Main() {
    const [files_board_content, set_files_board_content] = useState([])
    const [buckets_list, set_buckets_list] = useState([])
    const [current_prefix, set_current_prefix] = useState('')
    const [previus_prefix, set_previus_prefix] = useState('')
    const [current_bucket, set_current_bucket] = useState('')
    const [is_empty, set_is_empty] = useState(false)
    const [is_loading, set_is_loading] = useState(false)

    useEffect(function(){
        get_buckets()
    }, [])

    async function get_buckets(){
        try {
            const response = await api.get('/get_buckets')
            set_buckets_list(response.data)
        } catch (error) {
            if (error.response.status >= 400){
                console.log(error.response.data)
            } else {
                console.log('Oops! ocorreu um erro inesperado')
            }
        }
    }

    useEffect(function() {
        if (!is_loading){
            set_files_board_content([])
            get_objects('')
        }
    }, [current_bucket])

    async function get_objects(prefix, is_previus){
        if (current_bucket === ''){
            return
        }
        try {
            set_is_loading(true)
            let new_prefix
            let new_previus
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

            if (is_previus && current_prefix === ''){
                return
            }

            const config = {
                "headers": {
                    "x-bucket": current_bucket,
                    "x-prefix": new_prefix
                }
            }
            console.log(config)
            const response = await api.get('/get_object_list', config)
            
            if (response.data.length === 0){
                set_is_empty(true)
            } else {
                set_is_empty(false)
            }
            set_files_board_content(response.data)
            set_current_prefix(new_prefix)
        } catch (error) {
            if (error.response.status >= 400){
                console.log(error.response.data)
            } else {
                console.log('Oops! ocorreu um erro inesperado')
            }
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
            console.log(header)
            const response = await api.get('/download_object', header)
            console.log(response)
            download_file(file_name, response.data)
            // set_download_file(response.data)
        } catch (error) {
            if (error.response.status >= 400){
                console.log(error.response.data)
            } else {
                console.log('Oops! ocorreu um erro inesperado')
            }
        }
    }

    return (
        <>
            <Header current_folder={current_prefix} previus_folder={previus_prefix} get_objects={get_objects}/>
            <main>
                <BucketSelector buckets_list={buckets_list} set_current_bucket={set_current_bucket} is_loading={is_loading}/>
                <FilesBoard content={files_board_content} get_objects={get_objects} download_object={download_object} is_empty={is_empty} is_loading={is_loading}/>
                {/* <iframe src={download_file} style={{display: 'none'}}></iframe> */}
            </main>
        </>
    );
}


export default Main;
