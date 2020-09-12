import React, { Component, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

export function ImageTile({ selectedImageIndexes, file, onRemoveImage, onPreview, onRotateImage, onResetImage, index, onImageSelect }) {

  const ImageStyle = { padding: "2px", backgroundColor: "#fff", objectFit: "contain", width: '100%', height: '100%' }
  const ImageStyleWithBorder = { border: "2px solid #0870d1", padding: "2px", backgroundColor: "#fff", objectFit: "contain", width: '100%', height: '100%' }
  const [imageRef, setImageRef] = useState('')
  const [crop, setCropState] = useState({});
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

    if (degree == 90 || degree == 270) {
      canvas.width = img.height;
      canvas.height = img.width;
    }
    else {
      canvas.width = img.width;
      canvas.height = img.height;
    }

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
    canvas.width = Math.ceil(crop.width * scaleX);
    canvas.height = Math.ceil(crop.height * scaleY);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
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
      }, file.type, 1);
    });
  }

  const onImageLoaded = image => {
    setImageRef(image)
  };

  const onCropComplete = c => {
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
      console.log("setCroppedimageURl is called!");
      setCroppedImageUrl(croppedImageUrl);
    }
  }

  const previewImage = (e) => {
    e.stopPropagation()
    setPreview(true);
    onPreview(index, croppedImageUrl)
    setCroppedImageUrl('')
  }

  const onRotateRight = async () => {
    setImageRef('');
    //setRotation(newRotation);
    setDirty(true);
    setRotation(90)
    
    const rotatedImageUrl = await getRotatedImg(90);
    onRotateImage(index, rotatedImageUrl)
  }

  const onSelectImage = (e) => {
    e.stopPropagation();
    onImageSelect(index, e.shiftKey);
  }

  return (<div onClick={onSelectImage}>
    {file.loading ? <Loader
      type="Puff"
      color="#00BFFF"
      height={20}
      width={20}
      timeout={10000} /> :
      <>
        {preview ?
          <img style={selectedImageIndexes.includes(index) ? ImageStyleWithBorder : ImageStyle} src={file.src} /> :
          <ReactCrop
            src={file.src}
            imageStyle={selectedImageIndexes.includes(index) ? ImageStyleWithBorder : ImageStyle} /* write here*/
            crop={crop}
            onImageLoaded={onImageLoaded}
            onComplete={onCropComplete}
            onChange={onCropChange}
          />
        }
        <p className="mb-1">{file.metaData.title}</p>
        <div className="">
          <i className="fa fa-trash mr-3" title="delete" onClick={() => { onRemoveImage(index) }}></i>
          {/* <button onClick={() => { onRemoveImage(index) }}> delete</button> */}
          <i className="fa fa-eye mr-3" title="preview" onClick={(e) => { if (dirty) { previewImage(e); } }}></i>
          {/* <button onClick={() => { setPreview(true); onPreview(index, croppedImageUrl) }}> preview</button> */}
          <i className="fa fa-shield fa-rotate-90 mr-3" title="rotate" onClick={() => { onRotateRight() }}></i>
          <i className="fa fa-undo mr-3" title="reset" onClick={() => { if (dirty) { setPreview(false); setRotation(0); onResetImage(index) } }}></i>
        </div>
      </>
    }

  </div>
  );
}
