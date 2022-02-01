const { promises: fs } = require("fs");
const AWS = require("aws-sdk");
// const config = require("../configs/configs")();

const s3 = new AWS.S3({
  accessKeyId: "config.s3.accessKeyId",
  secretAccessKey: "config.s3.secretAccessKey",
  // region: config.s3.region,
});

const BUCKET_NAME =" config.s3.bucketName";

async function uploadFilesToS3(req, res, uploadFileList) {
  if (
    uploadFileList &&
    uploadFileList.length &&
    uploadFileList[0] &&
    req.payload[uploadFileList[0].file]
  ) {
    let uploadFileLocation = [];
    const start = async () => {
      await asyncForEach(uploadFileList, async (uploadFile) => {
        if (
          req.payload[uploadFile.file] &&
          req.payload[uploadFile.file].length
        ) {
          const location = await upload(
            req.payload[uploadFile.file],
            uploadFile.folder
          );
          uploadFileLocation.push(location);
        } else if (
          req.payload[uploadFile.file] &&
          req.payload[uploadFile.file].path
        ) {
          const location = await upload(
            [req.payload[uploadFile.file]],
            uploadFile.folder
          );
          uploadFileLocation.push(location);
        }
      });
      return uploadFileLocation;
    };
    return start();
  } else {
    return [];
  }
}

async function upload(files, folder) {
  let uploadFiles = [];
  const start = async () => {
    await asyncForEach(files, async (file) => {
      const location = await s3Upload(file, folder);
      uploadFiles.push(location);
    });
    return uploadFiles;
  };
  return start();
}

async function s3Upload(file, folder) {
  return await fs
    .readFile(file.path)
    .then(async (fileContent) => {
      // Setting up S3 upload parameters
      const params = {
        Bucket: BUCKET_NAME+"/"+"config.s3.imagesFolder" + "/" + folder,
        Key: file.filename, // File name you want to save as in S3
        Body: fileContent,
        ACL: "public-read",
      };

      return params;
    })
    .then((params) => {
      return s3.upload(params).promise();
    })
    .then(async (data) => {
      console.log(`File uploaded successfully. ${data.Location}`);
      await fs.unlink(file.path);
      return data.Location;
    })
    .catch((err) => {
      console.log(`File uploaded failed ${err}`);
      return err;
    });
}

async function s3UploadBase64(folder, fileName, base64) {
  const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  const type = base64.split(';')[0].split('/')[1];
  const params = {
    Bucket: BUCKET_NAME+"/"+"config.s3.imagesFolder" + "/" + folder,
    Key: fileName, // type is not required
    Body: base64Data,
    ACL: 'public-read',
    ContentEncoding: 'base64', // required
    ContentType: `image/${type}` // required. Notice the back ticks
  }
  try {
    const { Location } = await s3.upload(params).promise();
    return Location;
  } catch (error) {
    console.log(`File uploaded failed ${error}`);
    return error;
  }
}

function createBucketInS3() {
  const params = {
    Bucket: BUCKET_NAME,
  };

  s3.createBucket(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log("Bucket Created Successfully", data.Location, data);
  });
}

async function deleteFilesFromS3(seller) {
  let obj = {
    panProof : seller.panProof,
    idProof : seller.idProof,
    companyAddressProofBillProof : seller.companyAddressProofBillProof,
    GSTProof : seller.GSTProof,
    bankDetailsProof : seller.bankDetailsProof,
  }
  await asyncForEach(Object.keys(obj), async (key) => {
    if( 
      (key === 'panProof' && obj[key]) ||
      (key === 'idProof' && obj[key]) ||
      (key === 'companyAddressProofBillProof' && obj[key]) ||
      (key === 'GSTProof' && obj[key]) ||
      (key === 'bankDetailsProof' && obj[key])
    ){
      const params = {
        Bucket: BUCKET_NAME,
        Key: obj[key].split('.com/')[1]
      };
      try {
        await s3.deleteObject(params).promise();
        console.log("file deleted Successfully");
      }catch (err) {
        console.log("ERROR in file Deleting : " + JSON.stringify(err));
      }
    }
  });

}

async function deleteShopImageFromS3(images) {
  await asyncForEach(images, async (key) => {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key.split('.com/')[1]
    };
    try {
      await s3.deleteObject(params).promise();
      console.log("file deleted Successfully");
    }catch (err) {
      console.log("ERROR in file Deleting : " + JSON.stringify(err));
    }
  });
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = {
  uploadFilesToS3,
  createBucketInS3,
  asyncForEach,
  deleteFilesFromS3,
  s3UploadBase64,
  deleteShopImageFromS3
};
