import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

export const DropzoneImage = ({ image, setImage }) => {

  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    console.log(newImages);
    setImage(newImages[newImages.length-1]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div style={{width: "50vh", height: "50vh", border: "1px solid",
        textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center"}}>
        {image ?
          <img src={image.preview} alt="" style={{maxWidth: "100%", maxHeight: "100%"}} />
          :
          <p>Arrastra y suelta imágenes aquí, o haz clic para seleccionar imágenes.</p>
        }
      </div>
    </div>
  );
};