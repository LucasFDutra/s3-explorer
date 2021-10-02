function Toast(){
    return (
        <div className="alert position-fixed bottom-0 end-0 p-3 m-3 text-white" id="toast-alert" style={{"display": "none", "zIndex": "11", "backgroundColor": "#cc1d31ff"}}>
        </div>
    )
}

export default Toast
