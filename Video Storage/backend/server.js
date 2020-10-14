var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 
const fileUpload = require('express-fileupload');
const config = require('./config.json');
const filesize = require('filesize');

app.use(cors())
app.use(fileUpload())

// Connection URL
const url = `mongodb://${config.dbUser}:${config.dbPassword}@172.20.0.54:27017/?authMechanism=DEFAULT&authSource=${config.dbUser}`;

// Database Name
const dbName = config.dbName;

// Create a new MongoClient
const client = new MongoClient(url);

app.get('/getVideos', function(req, res){

    client.connect(function (err) {
      const db = client.db(dbName);
      const collection = db.collection('VideoStorage');
      collection.find().toArray()
          .then(items => {
              console.log(`Successfully found videos.`)
              res.send(items);
          })
          .catch(err => console.error(`Failed to find documents: ${err}`))
    })

})

app.post('/uploadThumbnail/:id', function(req, res){
  let file = req.files.file;
  let id = req.params.id;
  let objectid = new ObjectId(id);

  client.connect(function (err) {
    console.log("Connected successfully to database");
    const db = client.db(dbName);
    const collection = db.collection('VideoStorage');

    collection.findOne({_id:objectid})
        .then(result => {
            if (result) {
              let updatedDocument = result;
              updatedDocument.thumbnail = file;
              collection.findOneAndReplace({_id:objectid}, updatedDocument);
              console.log('Succesfully added thumbnail')
              res.send('ok')
            } else {
              console.log("No document matches the provided query.")
            }
        })
        .catch(err => console.error(`Failed to find document: ${err}`))
})
})

app.post('/uploadVideo',function(req, res) {
    let file = req.files.file;

    client.connect(function (err) {
      console.log("Connected successfully to database");
      const db = client.db(dbName);
      const collection = db.collection('VideoStorage');
      collection.insertOne(
        {
          name: file.name,
          size: filesize(file.size),
          thumbnail: ''
        }
      );
      console.log("Video added to DB");
      res.status(200).send(req.files.file)
    })
});

app.put('/deleteVideo/:id', function (req, res) {

  let id = req.params.id;
  let objectid = new ObjectId(id);

  client.connect(function (err) {
      console.log("Connected successfully to database");
      const db = client.db(dbName);
      const collection = db.collection('VideoStorage');

      collection.findOne({_id:objectid})
          .then(result => {
              if (result) {
                  collection.deleteOne(result);
                  console.log('Succesfully deleted document');
                  res.send('ok')
              } else {
                  console.log("No document matches the provided query.")
              }
          })
          .catch(err => console.error(`Failed to find document: ${err}`))
  })
})

app.listen(8000, function() {
    console.log('Server running on port 8000');
});