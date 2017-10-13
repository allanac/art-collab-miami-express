const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const s3 = new aws.S3(
  {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
);

const myUploader =
multer (
  {
    storage:
      multerS3 (
              {
                s3: s3,
                bucket: process.env.AWS_BUCKET,
                contentType: multerS3.AUTO_CONTENT_TYPE,
                acl:'public-read'
              }
      )
  }
)

module.exports = myUploader;
