import { useEffect, useContext, useRef } from 'react'
import Bucket from '../components/bucket'
import { AppContext } from '../utils/contexts'
import './bucket_selector.css'


function BucketSelector(){
    const {buckets_list} = useContext(AppContext)
    const sidbar = useRef(null)
    const sidbar_resizer = useRef(null)

    useEffect(function(){
        sidbar_resizer.current.addEventListener('mousedown', mousedown)
        function mousedown(){
            window.addEventListener('mousemove', mousemove)
            window.addEventListener('mouseup', mouseup)

            function mousemove(mouse){
                if (mouse.clientX > 280 && (mouse.clientX/window.innerWidth) < 0.6){
                    sidbar.current.style.width = `${mouse.clientX}px`
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
        let margin_left = sidbar.current.style.marginLeft 
        if (margin_left){
            margin_left = parseInt(margin_left.replace('px', ''))
        }

        if (margin_left < 0){
            sidbar.current.style.marginLeft = 0
        } else {
            console.log(sidbar.current.style.width)
            sidbar.current.style.marginLeft = `-${sidbar.current.style.width ? sidbar.current.style.width : '280px'}`
        }
    }

    return (
        <>
        <span id="sidbar-hidden-span" onClick={()=>{handle_hidde_sidbar()}}/>
        <div id="buckets-sidbar" ref={sidbar} className="sidbar-show d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
            <div className="d-flex align-items-center mb-3 ms-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4">Buckets</span>
            </div>
            
            <ul className="nav nav-pills flex-column mb-auto" style={{"flexWrap": "unset"}}>
                {
                    buckets_list.map(function(e){
                        return(
                            <Bucket bucket_name={e} key={e}/>
                        )
                    })
                }
            </ul>
            <span id="sidbar-risezer" ref={sidbar_resizer}/>
        </div>
        </>
    )
}

export default BucketSelector
