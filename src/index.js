import ReactDOM from 'react-dom';
import React, { Component, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getUserSubscription } from './user';

import './App.css';

function MetaDataForm() {
  return <div class="col-4 mt-4">
    <form>
      <div class="form-check">
        <label class="form-check-label">
          <input type="checkbox" class="form-check-input" value="" />License This Photo
          </label>
      </div>

      <div class="form-group">
        <label for="exampleFormControlSelect1">Photo Privacy</label>
        <select class="form-control">
          <option>1</option>
          <option>2</option>
        </select>
      </div>
      <div class="form-group">
        <label for="exampleFormControlInput1">Title</label>
        <input type="email" class="form-control" placeholder="Title" />
      </div>
      <div class="form-group">
        <label for="exampleFormControlTextarea1">Descriptions</label>
        <textarea class="form-control" rows="3"></textarea>
      </div>

      <div class="form-group">
        <label for="exampleFormControlInput1">Enter Location</label>
        <input type="email" class="form-control" placeholder="Enter Location" />
      </div>
    </form>
  </div>
}

function ShowUploadUI() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const dragOver = (e) => {
    e.preventDefault();
  }

  const dragEnter = (e) => {
    e.preventDefault();
  }

  const dragLeave = (e) => {
    e.preventDefault();
  }

  const fileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }

    console.log(files);
  }
  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        // add to an array so we can display the name of file
        console.log("got valid file")
      } else {
        // add a new property called invalid
        files[i]['invalid'] = true;
        // add to the same array so we can display the name of the file
        setSelectedFiles(prevArray => [...prevArray, files[i]]);
        // set error message
        setErrorMessage('File type not permitted');
      }
    }

  }

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
      console.log("Invalid format")
    }
    return true;
  }

  // get the file type
  const fileType = (fileName) => {
    return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
  }


  return (
    <div className="container">
      <div className="drop-container" onDragOver={dragOver} onDragEnter={dragEnter} onDragLeave={dragLeave} onDrop={fileDrop}>
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
              </div>
              <div className="file-remove">X</div>
            </div>

          )

        }

      </div>

    </div>);
}


function ImageTile({ src, c }) {
  const [imageRef, setImageRef] = useState('')
  const [crop, setCropState] = useState(c);
  const [croppedImageUrl, setCroppedImageUrl] = useState('');

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }

        blob.name = fileName;
        let fileUrl = '';
        window.URL.revokeObjectURL(fileUrl);
        fileUrl = window.URL.createObjectURL(blob);
        resolve(fileUrl);
      }, 'image/jpeg');
    });
  }


  const onImageLoaded = image => {
    setImageRef(image)
  };

  const onCropComplete = crop => {
    makeClientCrop(crop);
  };

  const onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    setCropState(crop);
  };

  const makeClientCrop = async function (crop) {
    if (imageRef && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef,
        crop,
        'newFile.jpeg'
      );

      setCroppedImageUrl(croppedImageUrl);
    }
  }

  return (<>
    <ReactCrop
      src={src}
      crop={crop}
      ruleOfThirds
      onImageLoaded={onImageLoaded}
      onComplete={onCropComplete}
      onChange={onCropChange}
    />
    <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />

  </>
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedFiles: [],
      selectedFilesLength: 0,
      toUpload: false,
      crop: {
        unit: '%',
        width: 30,
        aspect: 16 / 9,
      },
      userSubscription: getUserSubscription()
    };


    this.onSelectFile = this.onSelectFile.bind(this);
    this.fileDrop = this.fileDrop.bind(this);
    this.validateFile = this.validateFile.bind(this);
  }

  onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const files = [];
      this.setState({ selectedFilesLength: e.target.files.length })

      for (var i = 0; i < e.target.files.length; i++) {
        // get item
        const reader = new FileReader();

        reader.addEventListener('load', () => {
          this.setState({
            selectedFiles: [...this.state.selectedFiles, reader.result]
          })


        });

        reader.readAsDataURL(e.target.files[i]);
      }
    }
  };

  dragOver(e) {
    e.preventDefault();
  }

  dragEnter(e) {
    e.preventDefault();
  }

  dragLeave(e) {
    e.preventDefault();
  }

  fileDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      this.handleFiles(files);
    }

    console.log(files);
  }

  handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
      if (this.validateFile(files[i])) {
        // add to an array so we can display the name of file
        console.log("got valid file")
      } else {
        // add a new property called invalid
        files[i]['invalid'] = true;
        // add to the same array so we can display the name of the file

        const reader = new FileReader();

        reader.addEventListener('load', () => {
          this.setState({
            selectedFiles: [...this.state.selectedFiles, reader.result]
          })
        });

        reader.readAsDataURL(files[i]);
      }

    }
  }

  validateFile(file) {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
      console.log("Invalid format")
    }
    return true;
  }

  render() {
    return (<div class="container-fluid App">
      {this.state.selectedFiles.length == 0 ? <ShowUploadUI /> :
        <div class="row">
          <div class="col-8 upload_bg" onDragOver={this.dragOver} onDragEnter={this.dragEnter} onDragLeave={this.dragLeave} onDrop={this.fileDrop}>
            <div class="col-12 my-4">
              <button class="btn btn-primary"><i class="fa fa-plus"></i> Add</button>
              <button class="btn btn-primary"><i class="fa fa-trash"></i> Delete</button>
            </div>
            <div>
              <input type="file" accept="image/*" onChange={this.onSelectFile} multiple />
            </div>
            <div class="col-12 row">
              <div class="col-3">
                {
                  [...Array(this.state.selectedFilesLength)].map((item, index) => {
                    return <ImageTile src={this.state.selectedFiles[index]} c={this.state.crop} />
                  })
                }
              </div>
            </div>
          </div>
          <MetaDataForm />
        </div>
      }
    </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
