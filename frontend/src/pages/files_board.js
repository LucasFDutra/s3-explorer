import FolderIcon from '../components/folder_icon'
import FileIcon from '../components/file_icon'

function FilesBoard(){
    return (
        <div className="p-2 d-flex align-content-start flex-wrap" style={{width: '-webkit-fill-available', background: '#282c34ff'}}>
                <FolderIcon folder_name='my_folder'/>
                <FileIcon file_name='teste.txt'/>
                <FileIcon file_name='teste.png'/>
                <FileIcon file_name='teste.css'/>
                <FileIcon file_name='teste.js'/>
                <FileIcon file_name='teste.py'/>
                <FileIcon file_name='teste.sh'/>
                <FileIcon file_name='teste.xml'/>
                <FileIcon file_name='teste.pdf'/>
        </div>
    )
}

export default FilesBoard
