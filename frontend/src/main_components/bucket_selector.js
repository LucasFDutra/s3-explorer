import { useEffect } from 'react'
import Bucket from '../components/bucket'

function BucketSelector({buckets_list, set_current_bucket, is_loading}){
    useEffect(function(){
        const sidbar = document.getElementById('buckets-sidbar')
        document.getElementById('sidbar-risezer').addEventListener('mousedown', mousedown)
        function mousedown(){
            window.addEventListener('mousemove', mousemove)
            window.addEventListener('mouseup', mouseup)

            function mousemove(mouse){
                if (mouse.clientX > 280 && (mouse.clientX/window.innerWidth) < 0.6){
                    sidbar.style.width = `${mouse.clientX}px`
                    def_buckets_html_title()
                }
            }

            function mouseup(mouse){
                window.removeEventListener('mousemove', mousemove)
                window.removeEventListener('mouseup', mouseup)
            }
        }
    }, [])

    function def_buckets_html_title(){
        Array.from(document.getElementsByClassName('bucket-title')).forEach(function(e){
            if (e.offsetWidth < e.scrollWidth){
                e.title = e.innerText
            } else {
                e.title = ''
            }
        })
    }

    function handle_hidde_sidbar(){
        const sidbar = document.getElementById('buckets-sidbar')
        console.log()
        let margin_left = sidbar.style.marginLeft 
        if (margin_left){
            margin_left = parseInt(margin_left.replace('px', ''))
        }

        if (margin_left < 0){
            sidbar.style.marginLeft = 0
        } else {
            console.log(sidbar.style.width)
            sidbar.style.marginLeft = `-${sidbar.style.width ? sidbar.style.width : '280px'}`
        }
    }

    return (
        <>
        <span id="sidbar-hidden-span" onClick={()=>{handle_hidde_sidbar()}}/>
        <div id="buckets-sidbar" className="sidbar-show d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
            <div className="d-flex align-items-center mb-3 ms-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4">Buckets</span>
            </div>
            
            <ul className="nav nav-pills flex-column mb-auto" style={{"flexWrap": "unset"}}>
                {
                    buckets_list.map(function(e){
                        return(
                            <Bucket bucket_name={e} key={e} set_current_bucket={set_current_bucket} is_loading={is_loading}/>
                        )
                    })
                }
            </ul>
            <span id="sidbar-risezer"/>
        </div>
        </>
    )
}

export default BucketSelector
