'use strict';
const Busboy = require('busboy');

const parse = (input) => new Promise((resolve, reject) => {
    const busboy = new Busboy({
        headers: {
            'content-type': 'multipart/form-data'
        }
    });

    const result = [];
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const uploadFile = {};

        file.on('data', data => {
            uploadFile.content = data;
        })

        file.on('end', () => {
            if(uploadFile.content) {
                uploadFile.filename = filename;
                uploadFile.contentType = mimetype;
                uploadFile.encoding = encoding;
                uploadFile.fieldname= fieldname;
                result.files.push(uploadFile);
            }
        })
    })

    busboy.on('field', (fieldname, value)=> {
        result[fieldname] = value;

    })

    busboy.on('error',(error)=> {
        reject(error);
    })

    busboy.on('finish', ()=> {
        resolve(result)
    });

    busboy.write(input, 'binary');
    busboy.end();
})

module.exports.parse = parse;