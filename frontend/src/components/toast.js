function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function show_toast(msg, type, time=5000){
    const toast_element = document.getElementById('toast-alert')
    toast_element.innerText = msg
    toast_element.style.display = "block"
    toast_element.style.backgroundColor = type === 'success' ? '#388b3eff' : "#cc1d31ff"
    await sleep(time)
    toast_element.style.display = "none"
}

function Toast(){
    return (
        <div id="toast-alert" className="alert position-fixed bottom-0 end-0 p-3 m-3 text-white" style={{"display": "none", "zIndex": "11"}}/>
    )
}

export {Toast, show_toast}
