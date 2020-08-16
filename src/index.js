import ReactDOM from 'react-dom';
import React, { Component, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getUserSubscription } from './user';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function MetaDataForm() {
  return <div class="col-4 mt-4">
    <form>
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

function ShowUploadUI({ showMaxLimitMessage, onSelectFiles }) {
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
    if (files.length <= 5) {
      onSelectFiles(e);
    }
    else {
      showMaxLimitMessage();
    }
  }

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length <= 5) {
      onSelectFiles(e);
    }
    else {
      showMaxLimitMessage();
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="drop-container" onDragOver={dragOver} onDragEnter={dragEnter} onDragLeave={dragLeave} onDrop={fileDrop}>

        <div className="col-12">
          <i class="fa fa-arrow-up"></i>
        </div>
        <div>
          <div class="choose_file">
            <span>Select Photos</span>
            <input name="Select File" type="file" accept="image/*" onChange={onSelectFile} multiple />
          </div>
        </div>
      </div>

      {/* <div className="file-display-container">
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
      </div> */}

    </div>);
}


function ImageTile({ src, onRemoveImage, onPreview, index, c }) {
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
    <button onClick={() => { onRemoveImage(index) }}> delete</button>
    <button onClick={() => { onPreview(index, croppedImageUrl) }}> preview</button>
  </>
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedFiles: [],
      crop: {
        unit: '%',
        width: 30,
        aspect: 16 / 9,
      },
      userSubscription: getUserSubscription()
    };


    this.onSelectFile = this.onSelectFile.bind(this);
    this.onSelectFiles = this.onSelectFiles.bind(this);
    this.fileDrop = this.fileDrop.bind(this);
    this.validateFile = this.validateFile.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
  }

  onShowMaxLimitMessage() {
    toast.error("Only 5 Images can be uploaded at a time!", {
      position: toast.POSITION.TOP_RIGHT
    });
  }

  onRemoveImage(index) {
    console.log("called", index);
    const selectedFiles = this.state.selectedFiles.filter((file, i) => i != index)
    this.setState({ selectedFiles: selectedFiles })
  }

  onPreview(index, croppedImageUrl){
    console.log(croppedImageUrl);
    let selectedFiles = [...this.state.selectedFiles];
    selectedFiles[index].originalSrc =  selectedFiles[index].src;
    selectedFiles[index].src = croppedImageUrl;
    this.setState({ selectedFiles: selectedFiles })
  }

  onReset(index) {

  }

  onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      console.log(e.target.files);
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

  onSelectFiles(e) {
    console.log("oH I am there");
    if (e.target.files && e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        // get item
        const fileName = e.target.files[i].name;
        const reader = new FileReader();

        reader.addEventListener('load', () => {
          console.log("inside", e);
          this.setState({
            selectedFiles: [...this.state.selectedFiles, { name: fileName, src: reader.result }],
          })
        });

        reader.readAsDataURL(e.target.files[i]);
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
      {this.state.selectedFiles.length == 0 ? <ShowUploadUI onSelectFiles={this.onSelectFiles} showMaxLimitMessage={this.onShowMaxLimitMessage} /> :
        <div class="row">
          <div class="col-8 upload_bg" onDragOver={this.dragOver} onDragEnter={this.dragEnter} onDragLeave={this.dragLeave} onDrop={this.fileDrop}>
            <div class="col-12 my-4">

              <div class="choose_file">
                <span>Add</span>
                <input name="Select File" type="file" accept="image/*" onChange={this.onSelectFiles} multiple />
              </div>
              <button class="btn btn-primary"><i class="fa fa-trash"></i> Remove ({})</button>
            </div>
            <div class="col-12 row">
              <div class="col-3">
                {
                  this.state.selectedFiles.map((item, index) => {
                    return <ImageTile  index={index} src={this.state.selectedFiles[index].src} c={this.state.crop} onRemoveImage={this.onRemoveImage} onPreview={onPreview}/>
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
