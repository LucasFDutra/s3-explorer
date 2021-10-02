function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function toast_control(msg, time=5000){
    const toast_element = document.getElementById('toast-alert')
    toast_element.innerText = msg
    toast_element.style.display = "block"
    await sleep(time)
    toast_element.style.display = "none"
}

export default toast_control