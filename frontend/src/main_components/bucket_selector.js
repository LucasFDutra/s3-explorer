import { useState, useEffect } from 'react'
import Bucket from '../components/bucket'

function BucketSelector({buckets_list, set_current_bucket, is_loading}){
    function handle_hidde_sidbar(){
        const sidbar = document.getElementById('buckets-sidbar')
        if (sidbar.classList.contains('sidbar-hidden')){
            sidbar.classList.remove('sidbar-hidden')
        } else {
            sidbar.classList.add('sidbar-hidden')
        }
    }

    return (
        <>
        <span id="sidbar-hidden-span" onClick={()=>{handle_hidde_sidbar()}}/>
        <div id="buckets-sidbar" className="sidbar-show d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
            <div className="d-flex align-items-center mb-3 ms-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4">Buckets</span>
            </div>
            
            <ul className="nav nav-pills flex-column mb-auto" style={{flexWrap: "unset"}}>
                {
                    buckets_list.map(function(e){
                        return(
                            <Bucket bucket_name={e} key={e} set_current_bucket={set_current_bucket} is_loading={is_loading}/>
                        )
                    })
                }
            </ul>
        </div>
        </>
    )
}

export default BucketSelector
