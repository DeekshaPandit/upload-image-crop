import ReactDOM from 'react-dom';
import React, { Component, useState } from 'react';

import { ImageTile } from './ImageTile';
import { MetaDataForm } from './MetaDataForm';
import { getUserSubscription, getCategories } from './user';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UploadIcon from "./assets/images/icon_upload.svg";
import './App.css';
import ConfirmModal from './confirm'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios, { post } from 'axios';
import { BASEURL, CONFIG } from './constant';

const defaultMetaData = { name: "", privacy: "public", title: "", description: "", location: "", breath: 0, width: 0, length: 0, category: 1, nsfw: false, watermark: false, tags: [] }
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
          <div className="choose_file mt-2">
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

class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedFiles: [],
      removeFiles: [],
      selectedImageIndex: [0],
      crop: {
        unit: '%',
        width: 30,
        aspect: 16 / 9,
      },
      showDeleteConfirmationBox: false,
      userSubscription: getUserSubscription(),
      cancel: false
    };

    this.onSelectFile = this.onSelectFile.bind(this);
    this.onSelectFiles = this.onSelectFiles.bind(this);
    this.fileDrop = this.fileDrop.bind(this);
    this.dragEnter = this.dragEnter.bind(this);
    this.dragLeave = this.dragLeave.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.validateFile = this.validateFile.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
    this.onRemoveImages = this.onRemoveImages.bind(this);
    this.onPreview = this.onPreview.bind(this);
    this.onRotateImage = this.onRotateImage.bind(this);
    this.onResetImage = this.onResetImage.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onMetaDataUpdate = this.onMetaDataUpdate.bind(this);
    this.onImageSelect = this.onImageSelect.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.onImageContainerClick = this.onImageContainerClick.bind(this);
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
    console.log("has called remove Images");
    if (this.state.selectedFiles.length > 0) {
      this.setState({ showDeleteConfirmationBox: true })
    }
  }

  onConfirm(value) {
    if (value && this.state.removeFiles.length > 0) {
      const selectedFiles = this.state.selectedFiles.filter((file, i) => !this.state.removeFiles.includes(i))
      this.setState({ selectedFiles: selectedFiles, removeFiles: [], showDeleteConfirmationBox: false, cancel: false })
    }
    else if (value) {
      this.setState({ selectedFiles: [], removeFiles: [], showDeleteConfirmationBox: false, cancel: false })
    }
    else {
      this.setState({ showDeleteConfirmationBox: false, removeFiles: [], cancel: false });
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

  dragOver = (e) => {
    e.preventDefault();
  }

  dragEnter = (e) => {
    e.preventDefault();
  }

  dragLeave = (e) => {
    e.preventDefault();
  }

  fileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length <= 5) {
      this.onSelectFiles(e);
    }
    else {
      this.showMaxLimitMessage();
    }
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
    const files = e.target.files || e.dataTransfer.files;
    if (files && files.length > 5) {
      this.onShowMaxLimitMessage();
    }
    else if (files && files.length > 0) {
      this.setState({ selectedImageIndex: [] })
      for (let i = 0; i < files.length; i++) {
        // get item
        if (this.state.selectedFiles.length + i + 1 <= this.state.userSubscription.maximumPictures) {
          const fileName = files[i].name;
          const duplicateFiles = this.state.selectedFiles.filter((file, index) => file.name == fileName);

          if (duplicateFiles.length > 0) {
            toast.info(`This file has already been uploaded: ${duplicateFiles[0].name}`, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
          else {
            const metaData = Object.assign({}, defaultMetaData);
            metaData.title = fileName.substr(0, fileName.lastIndexOf('.'));
            metaData.name = fileName;

            const reader = new FileReader();
            reader.addEventListener('load', (e) => {
              this.setState({
                selectedFiles: [...this.state.selectedFiles, { src: reader.result, originalSrc: reader.result, metaData: metaData, loading: true }]
              }, () => {
                // update fileData to the respective file reference.
                const selectedIndex = this.state.selectedFiles.findIndex((file, index) => file.metaData.name == fileName)
                let selectedFiles = [...this.state.selectedFiles]
                selectedFiles[selectedIndex].loading = false
                let imageIndexes = [...this.state.selectedImageIndex]
                imageIndexes.push(selectedIndex);
                this.setState({ selectedFiles: selectedFiles, selectedImageIndex: imageIndexes })
              })
            });
            reader.readAsDataURL(files[i]);
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
    }
    return true;
  }

  onImageSelect(index) {
    console.log("selected index:", index);
    let selectedImages = [...this.state.selectedImageIndex];
    if (!this.state.selectedImageIndex.includes(index)) {
      selectedImages.push(index)
    }

    this.setState({ selectedImageIndex: selectedImages })
  }

  onMetaDataUpdate(index, name, value) {
    let selectedFiles = [...this.state.selectedFiles];

    this.state.selectedImageIndex.forEach((imageIndex, i) => {
      selectedFiles[imageIndex].metaData[name] = value;
      if (name === "tags") {
        let tags = [...selectedFiles[imageIndex].metaData[name]]
        console.log(value);

        tags.push(value);
      }
    })

    this.setState({ selectedFiles: selectedFiles })
  }

  onCancel() {
    this.setState({ cancel: true, showDeleteConfirmationBox: true });
  }

  uploadFiles() {
    const url = "http://localhost:4200/uploadFiles"
    const formData = new FormData();
    for (var i = 0; i < this.state.selectedFiles.length; i++) {
      let file = this.state.selectedFiles[i];
      const postFile = {
        source: file.src,
        metaData: file.metaData
      }

      var arr = file.src.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      const f = new File([u8arr], file.metaData.name, { type: mime });

      formData.append(`file-${i}`, f);
      formData.append(`metaData-${i}`, JSON.stringify(file.metaData));
    }

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    console.log("called file upload!");
    post(url, formData, config).then((data)=> {
      toast.info("Successfully uploaded", toast.POSITION.TOP_RIGHT)
    }).catch((err)=> {
      toast.error("Error while uploading.", toast.POSITION.TOP_RIGHT)
    })
  }

  onImageContainerClick() {
    this.setState({ selectedImageIndex: [0] });
  }

  render() {
    return (<div className="container-fluid App">
      <ToastContainer />
      <ConfirmModal showBox={this.state.showDeleteConfirmationBox} cancel={this.state.cancel} onConfirm={this.onConfirm} photosLength={this.state.removeFiles.length > 0 ? this.state.removeFiles.length : this.state.selectedFiles.length} />

      {this.state.selectedFiles.length == 0 ? <ShowUploadUI onSelectFiles={this.onSelectFiles} showMaxLimitMessage={this.onShowMaxLimitMessage} /> :
        <div className="row">
          <div className="col-12 col-md-8 col-lg-8 col-xl-9 upload_bg" onDragOver={this.dragOver} onDragEnter={this.dragEnter} onDragLeave={this.dragLeave} onDrop={this.fileDrop}>
            <div className="col-12 my-4 d-flex justify-content-between">
              <div className="">
                <div className="add_file text-center mr-2">
                  <span><i className="fa fa-plus"></i> Add</span>
                  <input name="Select File" type="file" accept="image/*" onChange={this.onSelectFiles} multiple />
                </div>
                <button className="btn btn-second" onClick={this.onRemoveImages}><i className="fa fa-trash"></i> Remove ({this.state.selectedFiles.length})</button>
              </div>
              <div>
                <button className="btn btn-second"><i className="fa fa-copy"></i> MultiSelect</button>
              </div>
            </div>
            <div className="d-flex flex-wrap image-container" onClick={() => { this.onImageContainerClick() }}>
              {
                this.state.selectedFiles.map((item, index) => {
                  return <div className="col-12 col-md-4 col-lg-4 col-xl-3 mb-4"><ImageTile index={index} file={this.state.selectedFiles[index]}
                    c={this.state.crop} onRemoveImage={this.onRemoveImage} onPreview={this.onPreview} onRotateImage={this.onRotateImage} onResetImage={this.onResetImage} onImageSelect={this.onImageSelect} /></div>
                })
              }

            </div>
          </div>
          <div className="col-12 col-md-4 col-lg-4 col-xl-3 right_panel">
            <div className="wrapper">
              <div className="header">
                <h6 className="font-weight-bold">{`${this.state.selectedImageIndex.length} photos selected`}</h6>

              </div>
              <MetaDataForm index={this.state.selectedImageIndex} metaData={this.state.selectedFiles[0].metaData} onInputChange={this.onMetaDataUpdate} />
              <div className="submit_form">
                <button className="btn btn-second mr-2" onClick={this.onCancel}>Cancel</button>
                <button className="btn btn-primary mr-2" onClick={this.uploadFiles}>Upload</button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
