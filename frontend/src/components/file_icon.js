import CssIcon from '../icons/css.svg'
import CsvIcon from '../icons/csv.svg'
import DocxIcon from '../icons/docx.svg'
import HtmlIcon from '../icons/html.svg'
import ImgIcon from '../icons/img.svg'
import JsIcon from '../icons/js.svg'
import OthersIcon from '../icons/others.svg'
import PdfIcon from '../icons/pdf.svg'
import PhpIcon from '../icons/php.svg'
import PptxIcon from '../icons/pptx.svg'
import PyIcon from '../icons/py.svg'
import ShIcon from '../icons/sh.svg'
import SqlIcon from '../icons/sql.svg'
import XmlIcon from '../icons/xml.svg'

const extentions = {
    'css': CssIcon,
    'csv': CsvIcon,
    'docx': DocxIcon,
    'html': HtmlIcon,
    'jpg': ImgIcon,
    'jpeg': ImgIcon,
    'png': ImgIcon,
    'svg': ImgIcon,
    'gif': ImgIcon,
    'js': JsIcon,
    'others': OthersIcon,
    'pdf': PdfIcon,
    'php': PhpIcon,
    'pptx': PptxIcon,
    'py': PyIcon,
    'sh': ShIcon,
    'sql': SqlIcon,
    'xml': XmlIcon,
}

function FileIcon({file_name, file_key, download_object}){
    const file_split = file_name.split('.')
    let file_extention = file_split[file_split.length-1]
    if (file_split.length === 1){
        file_extention = 'others'
    }

    file_extention = extentions[file_extention] ? extentions[file_extention] : extentions['others']

    return (
        <div className="me-2 d-flex flex-column align-items-center justify-content-center my-board-component">
            <img onDoubleClick={() => {download_object(file_name, file_key)}} src={file_extention} className="my-board-component-img" alt=''/>
            <span className="text-white text-center" style={{width: "8rem", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}} title={file_name.length > 13 ? file_name : null}>{file_name}</span>
        </div>
    )
}

export default FileIcon