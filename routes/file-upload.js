var express = require('express');
var router = express.Router();
var AWS = require("aws-sdk");
const multer = require("multer");
const keys = require("../config/keys");
const Files = require('./../models/files');
// var array = require('./arrayFile.js');

 var storage = multer.memoryStorage();
 var upload = multer({storage: storage, limits: {fileSize: 10 * 1024 * 1024}}).single('myImage');

// router.get('/upload',(req,res)=>res.render('dashboard'));
// POST to upload
// upload file to s3 and log file details
router.post('/', (req, res) => {

  upload(req, res, (err) => {
      
    const moment = require('moment');    
    //File Upload started
    var startDate = new Date();
    console.log('%%%%%%%%');
    console.log(req.file);
    const file = req.file;

    console.log(file.fieldname+('-')+Date.now());

    const s3FileURL = keys.s3Url;

    let s3bucket = new AWS.S3({
        accessKeyId: keys.AwsAccessKeyId,
        secretAccessKey: keys.AwsSecretAccessKey,
        region: keys.region
    });

    //Location of store for file upload

    var params = {
        Bucket: keys.bucketName,
        Key: file.fieldname+('-')+Date.now(),
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
    };

    

    s3bucket.upload(params, function (err, data) {
        var cnt = "";

        if (err) {
            res.status(500).json({error: true, Message: err});
        } else {
            //success
            res.send(data.Location);

            //File Upload ended       
            var endDate   = new Date();
            console.log(`Difference in seconds:`+(endDate - startDate) / 1000);
            
            const newFile = new Files({
              user : 'Manish Lokhande',
              email : 'manish@gmail.com',
              fileUrl:data.Location,
              fileName: file.originalname,
              fileDesc: file.originalname,
              uploadTime: ((endDate - startDate) / 1000),
              modifiedDate: ((endDate - startDate) / 1000)
          });
            //check if already exisits
            Files.findOne({ fileName:file.originalname })
            .then( (fileName) => {

                newFile.update()
                .then(file => {
                  req.flash('success_msg','File Uploaded!!');
              })
              .catch(err=>console.log(err));
            });

        }
    });
  });
});

module.exports = router;