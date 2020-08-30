import React, { Component, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

export function ImageTile({ file, onRemoveImage, onPreview, onRotateImage, onResetImage, index, c, onImageSelect }) {

  const ImageStyle = { border: "2px solid #0870d1", padding: "2px", backgroundColor: "#fff", objectFit: "contain" }
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
    canvas.width = img.width;
    canvas.height = img.height;

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

  const onSelectImage = (e) => {
    e.stopPropagation();
    console.log(e);
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
          <img style={ImageStyle} src={file.src} /> :
          <ReactCrop
            src={file.src}
            imageStyle={ImageStyle} /* write here*/
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
          <i className="fa fa-eye mr-3" title="preview" onClick={() => { if (dirty) { previewImage(); } }}></i>
          {/* <button onClick={() => { setPreview(true); onPreview(index, croppedImageUrl) }}> preview</button> */}
          <i className="fa fa-shield fa-rotate-90 mr-3" title="rotate" onClick={() => { onRotateRight() }}></i>
          <i className="fa fa-undo mr-3" title="reset" onClick={() => { if (dirty) { setPreview(false); setCropState(c); setRotation(0); onResetImage(index) } }}></i>
        </div>
      </>
    }

  </div>
  );
}
