import ReactDOM from 'react-dom';
import React, { Component, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getUserSubscription } from './user';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UploadIcon from "./assets/images/icon_upload.svg";
import './App.css';
import ConfirmModal from './confirm'
import 'bootstrap/dist/css/bootstrap.min.css';
import SuggestionTag from './suggestion-tag'

function MetaDataForm() {
  return <div class="col-4 p-0">
    <div className="edit-panel">
      <div className="header">
        <h6 className="font-weight-bold">4 photos selected</h6>
      </div>
      <div className="scrollable-panel">

        <form>
          <div class="form-group">
            <label for="exampleFormControlSelect1">Photo Privacy</label>
            <select class="form-control">
              <option>Public Accessible everywhere, including on Profile</option>
              <option>Unlisted Accessible everywhere, except on Profile</option>
              <option>Limited access Only visible to you, unless added to a Gallery</option>
            </select>
          </div>
          <div class="form-group">
            <label for="exampleFormControlInput1">Title</label>
            <input type="email" class="form-control" placeholder="Title" />
          </div>
          <div class="form-group">
            <label for="exampleFormControlTextarea1">Description</label>
            <textarea class="form-control" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label for="exampleFormControlInput1">Enter Location</label>
            <input type="email" class="form-control" placeholder="Enter Location" />
          </div>
          <div class="form-group">
            <label for="exampleFormControlSelect1">Category</label>
            <select class="form-control">
              <option>1</option>
              <option>2</option>
            </select>
          </div>
          <div class="form-group">
            <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" id="customCheck1" name="example2"></input>
              <label class="custom-control-label" for="customCheck1">NSFW content</label>
              <p>This photo contains nudity, sexually explicit, or suggestive content.</p>
            </div>
          </div>
          <div class="form-group">
            <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" id="customCheck2" name="example3"></input>
              <label class="custom-control-label" for="customCheck2">Add watermark</label>
              <p>Add a 500px watermark to my photo when displayed..</p>
            </div>
          </div>
          < SuggestionTag />
        </form>

      </div>
      <div>
        <button class="btn btn-primary my-4">Upload</button>
      </div>
   
  </div>
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

      <div className="drop-container text-center" onDragOver={dragOver} onDragEnter={dragEnter} onDragLeave={dragLeave} onDrop={fileDrop}>

        <div className="col-12">
          <img src={UploadIcon} className="mb-4" />
        </div>
        <div className="col-12">
          <h5 className="font-weight-bold">Upload photos</h5>
          <div class="choose_file mt-2">
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
          <h6 className="">.jpg, .jpeg, .png, .tiff only</h6>
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

function ImageTile({ file, onRemoveImage, onPreview, onRotateImage, onResetImage, index, c, onImageSelect }) {
  const ImageStyle = { border: "2px solid #0870d1", padding: "2px", backgroundColor: "#fff", height: "200px", objectFit: "contain", width: "100%" }
  const [imageRef, setImageRef] = useState('')
  const [crop, setCropState] = useState(c);
  const [dirty, setDirty] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState('');
  const [rotation, setRotation] = useState(0);
  const [preview, setPreview] = useState(false);

  const getRotatedImg = (degree) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext('2d');


    // draw the image
    // since the context is rotated, the image will be rotated also
    const img = new Image();
    img.src = file.src;
    canvas.width = 2000;
    canvas.height = 2000;

    // move to the center of the canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // rotate the canvas to the specified degrees
    ctx.rotate(degree * Math.PI / 180);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    // we’re done with the rotating so restore the unrotated context
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }

        blob.name = file.name;
        resolve(blob);
      }, file.type);
    });
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
        // let fileUrl = '';
        // window.URL.revokeObjectURL(fileUrl);
        // fileUrl = window.URL.createObjectURL(blob);
        resolve(blob);
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
    setCropState(crop);
  };

  const makeClientCrop = async function (crop) {
    if (imageRef && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef,
        crop
      );

      setDirty(true);
      setCroppedImageUrl(croppedImageUrl);
    }
  }

  const previewImage = () => {
    setPreview(true);
    onPreview(index, croppedImageUrl)
  }

  const onRotateRight = async () => {
    setImageRef('');
    //setRotation(newRotation);
    setDirty(true);
    const rotatedImageUrl = await getRotatedImg(90);
    onRotateImage(index, rotatedImageUrl)
  }

  const onRotateleft = async () => {
    let newRotation = rotation - 90;
    if (newRotation >= 360) {
      newRotation = - 360;
    }

    setRotation(newRotation);
    await getRotatedImg(newRotation);
  }

  return (<div onSelect={() => { onImageSelect(index); }}>
    {preview ?
      <img style={ImageStyle} src={file.src} /> :
      <ReactCrop
        src={file.src}
        imageStyle={ImageStyle} /* write here*/
        crop={crop}
        ruleOfThirds
        onImageLoaded={onImageLoaded}
        onComplete={onCropComplete}
        onChange={onCropChange}
      />
    }
    <div className="">
      <i class="fa fa-trash mr-3" title="delete" onClick={() => { onRemoveImage(index) }}></i>
      {/* <button onClick={() => { onRemoveImage(index) }}> delete</button> */}
      <i class="fa fa-eye mr-3" title="preview" onClick={() => { if (dirty) { previewImage(); } }}></i>
      {/* <button onClick={() => { setPreview(true); onPreview(index, croppedImageUrl) }}> preview</button> */}
      <i class="fa fa-shield fa-rotate-90 mr-3" title="rotate" onClick={() => { onRotateRight() }}></i>
      <i class="fa fa-undo mr-3" title="reset" onClick={() => { if (dirty) { setPreview(false); setCropState(c); setRotation(0); onResetImage(index) } }}></i>

      {/* <button onClick={() => { onRotateleft() }}> rotate Left</button>
    <button onClick={() => { onRotateRight() }}> rotate Right</button> */}</div>
  </div>
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
      showDeleteConfirmationBox: false,
      userSubscription: getUserSubscription()
    };

    this.onSelectFile = this.onSelectFile.bind(this);
    this.onSelectFiles = this.onSelectFiles.bind(this);
    this.fileDrop = this.fileDrop.bind(this);
    this.validateFile = this.validateFile.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
    this.onRemoveImages = this.onRemoveImages.bind(this);
    this.onPreview = this.onPreview.bind(this);
    this.onRotateImage = this.onRotateImage.bind(this);
    this.onResetImage = this.onResetImage.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  onShowMaxLimitMessage() {
    toast.error("Only 5 Images can be uploaded at a time!", {
      position: toast.POSITION.TOP_RIGHT
    });
  }

  onShowUpgradeMessage() {
    toast.info("Please upgrade your subscription to upload more pictures!")
  }
  onRemoveImage(index) {
    this.setState({ showDeleteConfirmationBox: true, removeFiles: [index] })

  }

  onRemoveImages() {
    if (this.state.selectedFiles.length > 0) {
      this.setState({ showDeleteConfirmationBox: true })
    }
  }

  onConfirm(value) {
    if (value && this.state.removeFiles.length > 0) {
      const selectedFiles = this.state.selectedFiles.filter((file, i) => !this.state.removeFiles.includes(i))
      this.setState({ selectedFiles: selectedFiles, removeFiles: [], showDeleteConfirmationBox: false })
    }
    else if (value) {
      this.setState({ selectedFiles: [], removeFiles: [], showDeleteConfirmationBox: false })
    }
    else {
      this.setState({ showDeleteConfirmationBox: false, removeFiles: [] });
    }
  }

  onPreview(index, croppedImageUrl) {

    const reader = new FileReader();
    reader.readAsDataURL(croppedImageUrl);
    reader.addEventListener('load', () => {
      let selectedFiles = [...this.state.selectedFiles];
      selectedFiles[index].src = reader.result;
      this.setState({ selectedFiles: selectedFiles })

    });

  }

  onRotateImage(index, rotatedImageUrl) {
    const reader = new FileReader();
    reader.readAsDataURL(rotatedImageUrl);
    reader.addEventListener('load', () => {
      let selectedFiles = [...this.state.selectedFiles];
      selectedFiles[index].src = reader.result;
      this.setState({ selectedFiles: selectedFiles })
    });
  }

  onResetImage(index) {
    let selectedFiles = [...this.state.selectedFiles];
    selectedFiles[index].src = selectedFiles[index].originalSrc;

    this.setState({ selectedFiles: selectedFiles })
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
    if (e.target.files && e.target.files.length > 5) {
      this.onShowMaxLimitMessage();
    }
    else if (e.target.files && e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        // get item
        if (this.state.selectedFiles.length + i + 1 <= this.state.userSubscription.maximumPictures) {
          console.log("upload files:", e.target.files);
          const fileName = e.target.files[i].name;
          const duplicateFiles = this.state.selectedFiles.filter((file, index) => file.name == fileName);
          console.log(duplicateFiles)
          if (duplicateFiles.length > 0) {
            toast.info(`This file has already been uploaded: ${duplicateFiles[0].name}`, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
          else {

            const reader = new FileReader();

            reader.addEventListener('load', () => {
              console.log("inside", e);
              this.setState({
                selectedFiles: [...this.state.selectedFiles, { name: fileName, src: reader.result, originalSrc: reader.result }]
              })

            });

            reader.readAsDataURL(e.target.files[i]);

          }
        }
        else {
          this.onShowUpgradeMessage();
        }

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
      <ToastContainer />
      <ConfirmModal showBox={this.state.showDeleteConfirmationBox} onConfirm={this.onConfirm} photosLength={this.state.removeFiles.length > 0 ? this.state.removeFiles.length : this.state.selectedFiles.length} />

      {this.state.selectedFiles.length == 0 ? <ShowUploadUI onSelectFiles={this.onSelectFiles} showMaxLimitMessage={this.onShowMaxLimitMessage} /> :
        <div class="row">
          <div class="col-8 upload_bg" onDragOver={this.dragOver} onDragEnter={this.dragEnter} onDragLeave={this.dragLeave} onDrop={this.fileDrop}>
            <div class="col-12 my-4 d-flex">
              <div class="add_file text-center mr-2">
                <span><i class="fa fa-plus"></i> Add</span>
                <input name="Select File" type="file" accept="image/*" onChange={this.onSelectFiles} multiple />
              </div>
              <button class="btn btn-second" onClick={this.onRemoveImages}><i class="fa fa-trash"></i> Remove ({this.state.selectedFiles.length})</button>
            </div>
            <div class="col-12 row   image-container">

              {
                this.state.selectedFiles.map((item, index) => {
                  return <div class="col-4 mb-3"><ImageTile index={index} file={this.state.selectedFiles[index]} c={this.state.crop} onRemoveImage={this.onRemoveImage} onPreview={this.onPreview} onRotateImage={this.onRotateImage} onResetImage={this.onResetImage} /></div>
                })
              }

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
