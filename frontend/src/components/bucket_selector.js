import Bucket from './bucket'

function BucketSelector({buckets_list, set_current_bucket, is_loading}){
    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{width: "280px"}}>
            <div className="d-flex align-items-center mb-3 ms-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4">Buckets</span>
            </div>
            
            <ul className="nav nav-pills flex-column mb-auto">
                {
                    buckets_list.map(function(e){
                        return(
                            <Bucket bucket_name={e} key={e} set_current_bucket={set_current_bucket} is_loading={is_loading}/>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default BucketSelector
