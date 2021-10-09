import { useEffect } from "react"

function Spinner({idName}) {
    useEffect(function(){
        console.log('aquiii')
        const sidbar_is_hidden = document.getElementById('buckets-sidbar').classList.contains('sidbar-hidden')
        const spinner = document.getElementById(idName)
        if (sidbar_is_hidden){
            spinner.style.setProperty('--margin_left', '0');
        } else {
            spinner.style.setProperty('--margin_left', '110px');
        }
    }, [])

    return (
        <div id={idName}></div>
    )
}

export default Spinner