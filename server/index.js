const express = require("express");
const multer = require('multer');
const { Client } = require('pg');
const { parse } = require('./parse-multipart')
var connectionString = "postgres://postgres:admin@localhost:5432/PaintingCompetition";
const client = new Client({
    connectionString: connectionString
});

client.connect();

const app = express();
const bodyparser = require("body-parser");

const port = process.env.PORT || 3200;

// middleware
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/uploadFiles', async (request, response) => {
    request.on('data', async (data) => {
        const result =  await parse(data.toString('utf-8'));
        console.log(result);
       // console.log(result);
        // const insertQuery = `INSERT INTO ecanvas_image_info (image_title,image_size_length,image_size_breadth,image_size_width,image_loaded_on)
        // VALUES ()`;
        // client.query(insertQuery, function (err, result) {
        //     console.log(err);
        //     console.log(result);
        //     if (err) {
        //         console.log(err);
        //         response.status(400).send(err);
        //     }

        //     response.status(200).send(result);
        // });

       return response.status(200).json({ submitted: true });
    });
    console.log("got request, upload files!");
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.listen(port, () => {
    console.log(`running at port ${port}`);
}); 