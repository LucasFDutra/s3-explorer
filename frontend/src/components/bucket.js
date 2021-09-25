import FolderIcon from '../icons/folder.svg'

function Bucket({bucket_name, set_current_bucket, is_loading}){
    function handle_click(e){
        if (!is_loading){
            set_current_bucket(bucket_name)
            Array.from(document.getElementsByClassName('bucket-link')).forEach(function(e){
                e.classList.remove("active-bucket")
            })
            e.target.closest('.bucket-link').classList.add("active-bucket")
        }
    }

    return (
        <li>
            <span onClick={(e) => {handle_click(e)}} className="bucket-link nav-link text-white">
                <img className="me-2" src={FolderIcon} alt='' width='25px'/>
                <span className="bucket-title" title={bucket_name.length > 21 ? bucket_name : null}>{bucket_name}</span>
            </span>
        </li>
    )
}

export default Bucket