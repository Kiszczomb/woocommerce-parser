var express = require('express');
var bodyParser = require("body-parser");
var formidable = require('formidable');
var fs = require('fs');
var app = express();

// set the view engine to ejs:
app.set('view engine', 'ejs');

// serve static files:
app.use(express.static('public'));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// Process application/json
app.use(bodyParser.json({ limit: '50mb' }));

// Process text/csv
app.use(bodyParser.text({ limit: '50mb', type: "*/*" }));

// use res.render to load up an ejs view file:
// index page
app.get('/', (req, res) => {
    res.render('pages/index');
});

app.post('/save-result', (req, res) => {
    console.log('DEBUG - save-result attempt occured')
    res.sendStatus(200);
    filename = "./public/results/" + req.body.file_name;
    console.log(filename);

    fs.writeFile(filename, req.body.product_csv, { flag: 'wx' }, (err) => {
        if (err) return console.log(err);
        console.log("DEBUG - New file saved as " + filename);
    })

})

// Upload CSV file
app.post('/upload-csv', (req, res, next) => {
    const form = formidable({});

    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        if (files.product_csv.size == 0) {
            res.render('pages/error');
        } else {
            // res.json({ fields, files });
            res.render('pages/uploaded', {
                filename: files.product_csv.originalFilename,
                filetype: files.product_csv.mimetype,
                product_id: fields.product_id,
                product_name: fields.product_name
            });
        }
    });
});

// app.post('/upload-csv', async(req, res) => {
//     try {
//         var form = new formidable.IncomingForm();
//         form.parse(req, function(err, fields, files) {
//             console.log('file size:', file.size);
//             console.log('fields:', fields);
//             console.log('files:', files);
//             var oldpath = files.product_csv.filepath;
//             var newpath = './uploads/' + files.product_csv.originalFilename;
//             fs.rename(oldpath, newpath, function(err) {
//                 if (err) throw err;
//                 res.render('pages/uploaded')
//                     // res.write('File uploaded and moved!');
//                     // res.end();
//             });
//         });
//     } catch (err) {
//         res.status(500).send(err);

//     }
// });


// $ curl http://localhost:3000/notfound
// $ curl http://localhost:3000/notfound -H "Accept: application/json"
// $ curl http://localhost:3000/notfound -H "Accept: text/plain"

app.use(function(req, res, next) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('pages/error', { url: req.url });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.json({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});


const PORT = 3000;
app.listen(PORT, console.log("Server listening on port: " + PORT))