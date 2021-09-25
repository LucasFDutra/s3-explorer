function Bucket({bucket_name, set_current_bucket, is_loading}){
    function handle_click(e){
        if (!is_loading){
            set_current_bucket(bucket_name)
            Array.from(document.getElementsByClassName('bucket-link')).forEach(function(e){
                e.classList.remove("active-bucket")
            })
            e.target.classList.add("active-bucket")
        }
    }

    return (
        <li>
            <span onClick={(e) => {handle_click(e)}} className="bucket-link nav-link text-white">
                {bucket_name}
            </span>
        </li>
    )
}

export default Bucket