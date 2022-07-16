const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const multer = require('multer');
const upload = multer()
const { response } = require('express');
const PORT = 2121;
require('dotenv').config();

const s3 = require('./public/lib/s3')

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'Booru';
    
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    });

app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.get('/', (req, res) => {
    db.collection('Posts').find().toArray()
    .then( data => {
        res.render('index.ejs', { info: data })
    })
    .catch(error => console.log(error))

});

app.post('/createPost', upload.single('file'), (req, res) => {
    // db.collection('Posts').insertOne({text: req.body.words, file: req.body.file})
    console.log(req.file)
    console.log(req.body)
    const uploadParams = {Bucket: 'image-board-posts', Key: req.file.originalname, Body: req.file.buffer}
    s3.upload(uploadParams, (err, data) => {
        if (err) {
            console.log("Error", err);
          } if (data) {
            console.log("Upload Success", data.Location);
            res.redirect('/')
          }
    })
})


app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})