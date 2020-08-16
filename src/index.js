import ReactDOM from 'react-dom';
import React, { Component, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getUserSubscription } from './user';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UploadIcon from "./assets/images/icon_upload.svg";
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
      <div className="drop-container text-center" onDragOver={dragOver} onDragEnter={dragEnter} onDragLeave={dragLeave} onDrop={fileDrop}>

        <div className="col-12">
          <img src={UploadIcon} className="mb-4" />
        </div>
        <div className="col-12">
          <h5 className="font-weight-bold">Upload photos</h5>
          <div class="choose_file">
            <span>Select Photos</span>
            <input name="Select File" type="file" accept="image/*" onChange={onSelectFile} multiple />
          </div>
        </div>
        <div className="col-12 mt-5">
          <h6>Or drag and drop photos anywhere on this page</h6>
        </div>
      </div>

      <div className="col-12">
        <div className="requirement">
          <h6 className="font-weight-bold">Photo requirements</h6>
          <h6 className="">.jpg only</h6>
          <h6 className="">Max. photo dimensions are 200MP/megapixels</h6>
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


function ImageTile({ file, onRemoveImage, onPreview, onRotate, index, c }) {
  const [imageRef, setImageRef] = useState('')
  const [crop, setCropState] = useState(c);
  const [croppedImageUrl, setCroppedImageUrl] = useState('');
  const [rotation, setRotation] = useState(0);
  const [preview, setPreview] = useState(false);

  const getRotateImg = (degree) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // save the unrotated context of the canvas so we can restore it later
    // the alternative is to untranslate & unrotate after drawing
    ctx.save();

    // move to the center of the canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // rotate the canvas to the specified degrees
    ctx.rotate(degree);

    // draw the image
    // since the context is rotated, the image will be rotated also
    ctx.drawImage(imageRef, -imageRef.width / 2, -imageRef.width / 2);

    // we’re done with the rotating so restore the unrotated context
    ctx.restore();
  }

  const getCroppedImg = (image, crop) => {
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

        blob.name = file.name;
        let fileUrl = '';
        window.URL.revokeObjectURL(fileUrl);
        fileUrl = window.URL.createObjectURL(blob);
        resolve(fileUrl);
      }, file.type);
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
        crop
      );

      setCroppedImageUrl(croppedImageUrl);
    }
  }

  const onRotateRight = () => {
    let newRotation = rotation + 90;
    if (newRotation >= 360) {
      newRotation = - 360;
    }

    setRotation(newRotation);
    getRotateImg();
  }

  const onRotateleft = () => {
    let newRotation = rotation - 90;
    if (newRotation >= 360) {
      newRotation = - 360;
    }

    setRotation(newRotation);
  }

  return (<>
    {preview ?
      <img src={file.src} /> :
      <ReactCrop
        src={file.src}
        imageStyle={{ transform: `rotate(${rotation}deg)` }}
        crop={crop}
        ruleOfThirds
        onImageLoaded={onImageLoaded}
        onComplete={onCropComplete}
        onChange={onCropChange}
      />
    }

    <button onClick={() => { onRemoveImage(index) }}> delete</button>
    <button onClick={() => { setPreview(true); onPreview(index, croppedImageUrl) }}> preview</button>
    <button onClick={() => { onRotateleft() }}> rotate Left</button>
    <button onClick={() => { onRotateRight() }}> rotate Right</button>
  </>
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedFiles: [],
      removeFiles: [],
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
    this.onRemoveImages = this.onRemoveImages.bind(this);
    this.onPreview = this.onPreview.bind(this);
    this.onRotate = this.onRotate.bind(this);
  }

  onShowMaxLimitMessage() {
    toast.error("Only 5 Images can be uploaded at a time!", {
      position: toast.POSITION.TOP_RIGHT
    });
  }

  onRemoveImage(index) {
    if (!this.state.removeFiles.includes(index)) {
      this.setState({
        removeFiles: [...this.state.removeFiles, index]
      });
    }
  }

  onRemoveImages() {
    const selectedFiles = this.state.selectedFiles.filter((file, i) => !this.state.removeFiles.includes(i))
    console.log(selectedFiles);
    this.setState({ selectedFiles: selectedFiles, removeFiles: [] })
  }

  onPreview(index, croppedImageUrl) {
    console.log(croppedImageUrl);
    let selectedFiles = [...this.state.selectedFiles];
    selectedFiles[index].originalSrc = selectedFiles[index].src;
    selectedFiles[index].src = croppedImageUrl;
    this.setState({ selectedFiles: selectedFiles })
  }

  onRotate() {

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
    console.log("oH I am there", e.target.files);
    if (e.target.files && e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        // get item
        const fileName = e.target.files[i].name;
        const fileType = e.target.files[i].type;
        const reader = new FileReader();

        reader.addEventListener('load', () => {
          console.log("inside", e);
          this.setState({
            selectedFiles: [...this.state.selectedFiles, { name: fileName, type: fileType, src: reader.result }],
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
              <button class="btn btn-primary" onClick={this.onRemoveImages}><i class="fa fa-trash"></i> Remove ({this.state.removeFiles.length})</button>
            </div>
            <div class="col-12 row">
              <div class="col-3">
                {
                  this.state.selectedFiles.map((item, index) => {
                    return <ImageTile index={index} file={this.state.selectedFiles[index]} c={this.state.crop} onRemoveImage={this.onRemoveImage} onPreview={this.onPreview} onRotate={this.onRotate} />
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
