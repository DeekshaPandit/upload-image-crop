import React, {useState} from 'react';

const DropZone = () => {

const [selectedFiles, setSelectedFiles] = useState([]);
const [errorMessage, setErrorMessage] = useState('');
console.log("setSelectedFiles "+selectedFiles.length);
console.log("setErrorMessage "+errorMessage);
const dragOver = (e) => {
    e.preventDefault();
}

const dragEnter =(e) =>{
    e.preventDefault();
}

const dragLeave = (e) =>{
    e.preventDefault();
}

const fileDrop =(e)=>{
    e.preventDefault();
    const files = e.dataTransfer.files;
    if(files.length){
        handleFiles(files);
    }
   
    console.log(files);
}
const handleFiles = (files) =>{
    for(let i =0;i<files.length;i++){
        if(validateFile(files[i])){
            // add to an array so we can display the name of file
            console.log("got valid file")
        }else{
        // add a new property called invalid
        files[i]['invalid'] = true;
         // add to the same array so we can display the name of the file
        setSelectedFiles(prevArray => [...prevArray, files[i]]);
        // set error message
        setErrorMessage('File type not permitted');
        }
    }
  
}

const validateFile = (file)=>{
    const validTypes =["image/jpeg","image/jpg","image/png","image/gif","image/x-icon"];
    if(validTypes.indexOf(file.type) === -1){
        return false;
        console.log("Invalid format")
    }
    return true;
}

// Get the file size of the file
const fileSize = (size) => {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// get the file type
const fileType = (fileName) => {
    return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
}


    return (
        <div className="container">
            <div className="drop-container" onDragOver ={dragOver} onDragEnter ={dragEnter} onDragLeave={dragLeave} onDrop={fileDrop}>
                <div className="drop-message">
                    <div className="upload-icon"></div>
                    Drag and drop file or click here to upload
                </div>
            </div>

            <div className="file-display-container">
                {
                 
                    selectedFiles.map((data, i) => 
                        <div className="file-status-bar" key={i}>
                            <div>
                                <div className="file-type-logo"></div>
                                <div className="file-type">{fileType(data.name)}</div>
                                <span className={`file-name ${data.invalid ? 'file-error' : ''}`}>{data.name}</span>
                                <span className="file-size">({fileSize(data.size)})</span> {data.invalid && <span className='file-error-message'>({errorMessage})</span>}
                            </div>
                            <div className="file-remove">X</div>
                        </div>
                        
                    )
                    
                }
            
            </div>

        </div>
    )
}






export default DropZone;