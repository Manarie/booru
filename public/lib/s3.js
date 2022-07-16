const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});

s3.listBuckets((err, data) => {
    if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.Buckets);
      }
});

module.exports = s3;