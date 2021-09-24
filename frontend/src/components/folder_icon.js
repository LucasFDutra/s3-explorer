import FolderIconSvg from '../icons/folder.svg'

function FolderIcon({folder_name}){
    return (
        <div className="m-2 d-flex flex-column align-items-center justify-content-center my-board-component">
            <img src={FolderIconSvg} className="my-board-component-img"/>
            <span className="text-white">{folder_name}</span>
        </div>
    )
}

export default FolderIcon