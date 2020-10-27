/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */
'use strict';

const os = require("os");
const async = require('async');
const util = require('util');
const uuidv4 = require('uuid/v4');
const path = require('path');
const url = require('url');
const fs = require('fs');

const MediaServices = require('azure-arm-mediaservices');
const msRestAzure = require('ms-rest-azure');
const msRest = require('ms-rest');
const azureStorage = require('azure-storage');

const setTimeoutPromise = util.promisify(setTimeout);

// endpoint config
// make sure your URL values end with '/'

var armAadAudience = "https://management.core.windows.net/";
var aadEndpoint = "https://login.microsoftonline.com/";
var armEndpoint = "https://management.azure.com/";
var subscriptionId = "e9a8fdd5-fa93-4cd4-9046-bbc96acbd6c8";
var accountName ="finalworkmediaservice";
var region ="West Europe";
var aadClientId = "fabc483c-6bac-4ced-b8ba-ed404a0bd271";
var aadSecret ="gPiA1437Z3Bw~HF~OImb~5i-rKA.Gd9wFE";
var aadTenantId ="c2a59f2b-5d20-4b2a-a9a3-7a8605b14e3f";
var resourceGroup ="FinalWork";

// args
var outputFolder = "Temp";
var namePrefix = "prefix";

// You can either specify a local input file with the inputFile or an input Url with inputUrl.  Set the other one to null.

// var inputFile = "C:\\Users\\Tim\\Desktop\\Multec\\20-21 Semester 1\\Web III\\Video Storage\\backend\\temp\\Dab.mp4";
var inputUrl = null;

var encodingTransformName = "TransformWithAdaptiveStreamingPreset";

// constants
var timeoutSeconds = 60 * 10;
var sleepInterval = 1000 * 15;

var azureMediaServicesClient;
var inputExtension;
var blobName = null;


var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 
const config = require('./config.json');
const filesize = require('filesize');

app.use(cors())

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, './temp')
},
  filename: function (req, file, cb) {
  cb(null, file.originalname)
}
})

var upload = multer({ storage: storage }).single('file')

// Connection URL
const uri = `mongodb+srv://${config.dbUser}:${config.dbPassword}@finalworkcluster.bcvg7.mongodb.net/${config.dbName}?retryWrites=true&w=majority`;

// Database Name
const dbName = config.dbName;

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true });

app.get('/getVideos', function(req, res){

    client.connect(function (err) {
      const db = client.db(dbName);
      const collection = db.collection('VideoStorage');
      collection.find().toArray()
          .then(items => {
              res.send(items);
          })
          .catch(err => console.error(`Failed to find documents: ${err}`))
    })

})

var uploadImage = multer()

app.post('/uploadThumbnail/:id', uploadImage.single('file'), function(req, res){
  let file = req.file;
  let id = req.params.id;
  let objectid = new ObjectId(id);

  client.connect(function (err) {
    const db = client.db(dbName);
    const collection = db.collection('VideoStorage');

    collection.findOne({_id:objectid})
        .then(result => {
            if (result) {
              let updatedDocument = result;
              updatedDocument.thumbnail = file;
              collection.findOneAndReplace({_id:objectid}, updatedDocument);
              res.send('ok')
            } else {
              console.log("No document matches the provided query.")
            }
        })
        .catch(err => console.error(`Failed to find document: ${err}`))
})
})

app.post('/updateTitle/:id/:title', function(req, res) {
  let id = req.params.id;
  let title = req.params.title;
  let objectid = new ObjectId(id);

  client.connect(function (err) {
    const db = client.db(dbName);
    const collection = db.collection('VideoStorage');

    collection.findOne({_id:objectid})
        .then(result => {
            if (result) {
              let updatedDocument = result;
              updatedDocument.name = title;
              collection.findOneAndReplace({_id:objectid}, updatedDocument);
              res.send('ok')
            } else {
              console.log("No document matches the provided query.")
            }
        })
        .catch(err => console.error(`Failed to find document: ${err}`))
  })
})

app.post('/uploadVideo',function(req, res) {
  
    upload(req, res, function (err) {
      if (err) {
        console.log(err)
        return res.status(500).json(err)
      }
      let filename = __dirname + '/temp/' + req.file.originalname;
      let uniqueness = uuidv4();
      client.connect(function (err) {
        const db = client.db(dbName);
        const collection = db.collection('VideoStorage');
        collection.insertOne(
          {
            name: req.file.originalname,
            size: filesize(req.file.size),
            thumbnail: '',
            urls: '',
            urlId: uniqueness
          }, function(err, resp){
            if(err) console.log(err)
            uploadToAzure(uniqueness, filename);
          })
      })
    return res.status(200).send(req.file)
    })
});

app.put('/deleteVideo/:id', function (req, res) {

  let id = req.params.id;
  let objectid = new ObjectId(id);

  client.connect(function (err) {
      const db = client.db(dbName);
      const collection = db.collection('VideoStorage');

      collection.findOne({_id:objectid})
          .then(result => {
              if (result) {
                  collection.deleteOne(result);
                  res.send('ok')
              }
          })
          .catch(err => console.error(`Failed to find document: ${err}`))
  })
})

app.listen(process.env.PORT || 8000, function() {
  console.log('Server running on port 8000');
});









function uploadToAzure(uniqueness, inputFile){

  msRestAzure.loginWithServicePrincipalSecret(aadClientId, aadSecret, aadTenantId, {
    environment: {
      activeDirectoryResourceId: armAadAudience,
      resourceManagerEndpointUrl: armEndpoint,
      activeDirectoryEndpointUrl: aadEndpoint
    }
  }, async function(err, credentials, subscriptions) {
      if (err) return console.log(err);
      azureMediaServicesClient = new MediaServices(credentials, subscriptionId, armEndpoint, { noRetryPolicy: true });
      
    parseArguments();
      try {
  
        
      // Ensure that you have the desired encoding Transform. This is really a one time setup operation.
      console.log("creating encoding transform...");
      let adaptiveStreamingTransform = {
          odatatype: "#Microsoft.Media.BuiltInStandardEncoderPreset",
          presetName: "AdaptiveStreaming"
      };
      let encodingTransform = await ensureTransformExists(resourceGroup, accountName, encodingTransformName, adaptiveStreamingTransform);
  
      console.log("getting job input from arguments...");
      let input = await getJobInputFromArguments(resourceGroup, accountName, uniqueness);
      let outputAssetName = namePrefix + '-output-' + uniqueness;
      let jobName = namePrefix + '-job-' + uniqueness;
      let locatorName = "locator" + uniqueness;
  
      console.log("creating output asset...");
      let outputAsset = await createOutputAsset(resourceGroup, accountName, outputAssetName);
  
      console.log("submitting job...");
      let job = await submitJob(resourceGroup, accountName, encodingTransformName, jobName, input, outputAsset.name);
  
      console.log("waiting for job to finish...");
      job = await waitForJobToFinish(resourceGroup, accountName, encodingTransformName, jobName);
  
      if (job.state == "Finished") {
        //await downloadResults(resourceGroup, accountName, outputAsset.name, outputFolder);
  
        let locator = await createStreamingLocator(resourceGroup, accountName, outputAsset.name, locatorName);
  
        let urls = await getStreamingUrls(resourceGroup, accountName, locator.name);
  
        console.log("deleting jobs ...");
        await azureMediaServicesClient.jobs.deleteMethod(resourceGroup, accountName, encodingTransformName, jobName);
       // await azureMediaServicesClient.assets.deleteMethod(resourceGroup, accountName, outputAsset.name);
  
        let jobInputAsset = input;
        if (jobInputAsset && jobInputAsset.assetName) {
          await azureMediaServicesClient.assets.deleteMethod(resourceGroup, accountName, jobInputAsset.assetName);
        }
      } else if (job.state == "Error") {
        console.log(`${job.name} failed. Error details:`);
        console.log(job.outputs[0].error);
      } else if (job.state == "Canceled") {
        console.log(`${job.name} was unexpectedly canceled.`);
      } else {
        console.log(`${job.name} is still in progress.  Current state is ${job.state}.`);
      }
      console.log("done with sample");
    } catch (err) {
      console.log(err);
    }
  });

  async function waitForJobToFinish(resourceGroup, accountName, transformName, jobName) {
    let timeout = new Date();
    timeout.setSeconds(timeout.getSeconds() + timeoutSeconds);
  
    async function pollForJobStatus() {
      let job = await azureMediaServicesClient.jobs.get(resourceGroup, accountName, transformName, jobName);
      console.log(job.state);
      if (job.state == 'Finished' || job.state == 'Error' || job.state == 'Canceled') {
        return job;
      } else if (new Date() > timeout) {
        console.log(`Job ${job.name} timed out.`);
        return job;
      } else {
        await setTimeoutPromise(sleepInterval, null);
        return pollForJobStatus();
      }
    }
  
    return await pollForJobStatus();
  }
  
  async function submitJob(resourceGroup, accountName, transformName, jobName, jobInput, outputAssetName) {
    let jobOutputs = [
      {
        odatatype: "#Microsoft.Media.JobOutputAsset",
        assetName: outputAssetName
      }
    ];
  
    return await azureMediaServicesClient.jobs.create(resourceGroup, accountName, transformName, jobName, {
      input: jobInput,
      outputs: jobOutputs
    });
  }
  
  
  async function getJobInputFromArguments(resourceGroup, accountName, uniqueness) {
    if (inputFile) {
      let assetName = namePrefix + "-input-" + uniqueness;
      await createInputAsset(resourceGroup, accountName, assetName, inputFile);
      return {
        odatatype: "#Microsoft.Media.JobInputAsset",
        assetName: assetName
      }
    } else {
      return {
        odatatype: "#Microsoft.Media.JobInputHttp",
        files: [inputUrl]
      }
    }
  }
  
  async function createOutputAsset(resourceGroup, accountName, assetName) {
      return await azureMediaServicesClient.assets.createOrUpdate(resourceGroup, accountName, assetName, {});
  }
  
  async function createInputAsset(resourceGroup, accountName, assetName, fileToUpload) {
    let asset = await azureMediaServicesClient.assets.createOrUpdate(resourceGroup, accountName, assetName, {});
    let date = new Date();
    date.setHours(date.getHours() + 1);
    let input = {
      permissions: "ReadWrite",
      expiryTime: date
    }
    let response = await azureMediaServicesClient.assets.listContainerSas(resourceGroup, accountName, assetName, input);
    let uploadSasUrl = response.assetContainerSasUrls[0] || null;
    let fileName = path.basename(fileToUpload);
    let sasUri = url.parse(uploadSasUrl);
    let sharedBlobService = azureStorage.createBlobServiceWithSas(sasUri.host, sasUri.search);
    let containerName = sasUri.pathname.replace(/^\/+/g, '');
    let randomInt = Math.round(Math.random() * 100);
    blobName = fileName + randomInt;
    console.log("uploading to blob...");
    function createBlobPromise() {
      return new Promise(function (resolve, reject) {
        sharedBlobService.createBlockBlobFromLocalFile(containerName, blobName, fileToUpload, resolve);
      });
    }
    await createBlobPromise();
    return asset;
  }
  
  async function ensureTransformExists(resourceGroup, accountName, transformName, preset) {
    let transform = await azureMediaServicesClient.transforms.get(resourceGroup, accountName, transformName);
  if (!transform) {
      transform = await azureMediaServicesClient.transforms.createOrUpdate(resourceGroup, accountName, transformName, {
      name: transformName,
      location: region,
      outputs: [{
        preset: preset
      }]
    });
  }
  return transform;
  }
  
  async function createStreamingLocator(resourceGroup, accountName, assetName, locatorName)
  {
    let streamingLocator = {
      assetName: assetName,
      streamingPolicyName: "Predefined_ClearStreamingOnly"
    };
  
    let locator = await azureMediaServicesClient.streamingLocators.create(
        resourceGroup,
        accountName,
        locatorName,
        streamingLocator);
  
    return locator;
  }
  
  async function getStreamingUrls(resourceGroup, accountName, locatorName)
  {
    // Make sure the streaming endpoint is in the "Running" state.
  
    let streamingEndpoint = await azureMediaServicesClient.streamingEndpoints.get(resourceGroup, accountName, "default");
  
    let paths = await azureMediaServicesClient.streamingLocators.listPaths(resourceGroup, accountName, locatorName);

    let urls = [];
  
    for (let i = 0; i < paths.streamingPaths.length; i++){
      let path = paths.streamingPaths[i].paths[0];
      urls.push("https://"+ streamingEndpoint.hostName + "//" + path);
      console.log("https://"+ streamingEndpoint.hostName + "//" + path);
    }

    client.connect(function (err) {
      const db = client.db(dbName);
      const collection = db.collection('VideoStorage');

      collection.findOne({urlId:uniqueness})
          .then(result => {
              if (result) {
                let updatedDocument = result;
                updatedDocument.urls = urls;
                collection.findOneAndReplace({urlId:uniqueness}, updatedDocument);
                res.send('ok')
              } else {
                console.log("No document matches the provided query.")
              }
          })
          .catch(err => console.error(`Failed to find document: ${err}`))
      })

      fs.unlink(inputFile, (err) => {
        if (err) throw err
      })
  }
  
  function parseArguments() {
    if (inputFile) {
      inputExtension = path.extname(inputFile);
    } else {
      inputExtension = path.extname(inputUrl);
    }
  }
  
  }