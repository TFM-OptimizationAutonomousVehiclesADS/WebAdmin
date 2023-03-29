import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { notificationController } from "@app/controllers/notificationController";

export const DropzoneCSV = ({ file, setFile }) => {

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[acceptedFiles.length - 1];
      if (file.path.endsWith(".csv")) {
        setFile(acceptedFiles[acceptedFiles.length - 1]);
      } else {
        notificationController.error({ message: "Format invalid. Please, select a CSV file." });
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    onDrop
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div style={{
        width: "100%", height: "30vh", border: "1px solid",
        textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center"
      }}>
        {file ?
          <p>File selected: {file.path}</p>
          :
          <p>Drag and drop the CSV file or click here to add the file</p>
        }
      </div>
    </div>
  );
};