
import mongoose from "mongoose";
import fs from "fs";



//  @param {import("express").Request} req
//  @param {string} fileName
//  @description returns the file's static path from where the server is serving the static image
export const getStaticFilePath = (req, fileName) => {
  return `${req.protocol}://${req.get("host")}/images/${fileName}`;
};


//  * @param {string} fileName
//  * @description returns the file's local path in the file system to assist future removal
export const getLocalPath = (fileName) => {
  return `public/images/${fileName}`;
};


//  * @param {string} localPath
//  * @description Removed the local file from the local file system based on the file path

export const removeLocalFile = (localPath) => {
  fs.unlink(localPath, (err) => {
    if (err) console.log("Error while removing local files: ", err);
    else {
      console.log("Removed local: ", localPath);
    }
  });
};

export const removeUnusedMulterImageFilesOnError = (req) => {
  try {
    const multerFile = req.file;
    const multerFiles = req.files;

    if (multerFile) {
      // If there is file uploaded and there is validation error
      // We want to remove that file
      removeLocalFile(multerFile.path);
    }

    if (multerFiles) {
      /** @type {Express.Multer.File[][]}  */
      const filesValueArray = Object.values(multerFiles);
      // If there are multiple files uploaded for more than one fields
      // We want to remove those files as well
      filesValueArray.map((fileFields) => {
        fileFields.map((fileObject) => {
          removeLocalFile(fileObject.path);
        });
      });
    }
  } catch (error) {
    // fail silently
    console.log("Error while removing image files: ", error);
  }
};