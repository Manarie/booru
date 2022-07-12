const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const PORT = 2121;
require('dotenv').config();

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'Booru';
    
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    });
    console.log('working?')

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

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})