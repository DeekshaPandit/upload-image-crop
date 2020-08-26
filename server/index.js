const express = require("express");
const multer = require('multer');
const { Client } = require('pg');
const path = require('path')
const connectionString = "postgres://postgres:admin@localhost:5432/PaintingCompetition";

const client = new Client({
    connectionString: connectionString
});

client.connect();
const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage }).any()

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

app.post('/uploadFiles', async (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.error(err)
            return res.status(500).json(err)
        } else if (err) {
            console.error(err)
            return res.status(500).json(err)
        }

        let fileMetaDatas = [];
        Object.keys(req.body).forEach((key, i) => {
            const metaData = { ...JSON.parse(req.body[key]) };
            const filePath = req.files.filter((file) => metaData.name == file.originalname)[0].path
            // LINE 2: ('laptop', 'images\1598414573864-Image2.jpg', 'This is lapto...
            //     ^
            // DETAIL: Array value must start with "{" or dimension information.
            // Adding a hack to pertain value of filePath
            metaData.filePath = `{${filePath}}`;
            fileMetaDatas.push(metaData);
        })

        console.log(fileMetaDatas);
        const valueArray = fileMetaDatas.map((m) => {
            return `('${m.title}', '${m.filePath}', '${m.description}', ${m.category}, ${m.price}, ${m.length}, ${m.breadth},${m.width})`
        });

        const queryValue = valueArray.join(',');
        const query = `INSERT INTO ecanvas_image_info(image_title, image_path,image_desc, image_category, image_price, image_size_length, image_size_breadth, image_size_width) VALUES ${queryValue}`;

        client.query(query, (err, data) => {
            if (err) {
                console.log(err)
                return res.status(500);
            }

            return res.status(200).json({ status: "Success" });
        })
    });
});

app.listen(port, () => {
    console.log(`running at port ${port}`);
}); 