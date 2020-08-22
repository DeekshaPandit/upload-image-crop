const express = require("express");
const multer = require('multer');
const { Client } = require('pg');
const path = require('path')
const fs = require("fs");
const { parse } = require('./multipart-parse')
var connectionString = "postgres://postgres:admin@localhost:5432/PaintingCompetition";
const client = new Client({
    connectionString: connectionString
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

var upload = multer({ storage: storage }).any()

client.connect();

const app = express();
const bodyparser = require("body-parser");

const port = process.env.PORT || 4200;
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// middleware
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/uploadFile', async (req, res, next) => {
    // upload(req, res, function (err) {
         
    //     if (err instanceof multer.MulterError) {
    //         console.error(err)
    //         return res.status(500).json(err)
    //     } else if (err) {
    //         console.error(err)
    //         return res.status(500).json(err)
    //     }
      return res.status(200).send({filePath: `rge`})
    // })
});

app.post('/uploadFiles', async (req, res, next) => {
    upload(req, res, function (err) {
        
        if (err instanceof multer.MulterError) {
            console.error(err)
            return res.status(500).json(err)
        } else if (err) {
            console.error(err)
            return res.status(500).json(err)
        }

        Object.keys(req.body).forEach((key,i)=> {
            
        })
        console.log(req.body)
});
});


app.listen(port, () => {
    console.log(`running at port ${port}`);
}); 