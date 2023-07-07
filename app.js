const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const { v4: uuidv4 } = require('uuid');

const path = require('path');

const app = express();


//Configuracion de multer
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename:(req, file, cb) => {
        cb(null, uuidv4() + '-' + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || 
       file.mimetype === 'image/jpg' ||
       file.mimetype === 'image/webp' ||
       file.mimetype === 'image/jpeg'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

//Middlewares
app.use(cors());
app.use(express.json());
//Configuracion de multer
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
//Ruta statica para imagenes
app.use('/images', express.static(path.join(__dirname, 'images')));

//Rutas
app.use('/feed', require('./routes/feed'));
app.use('/auth', require('./routes/auth'));

//Manejo de errores
app.use((error, req, res, next) => {

    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });

});

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Conectado a la base de datos');
        const server = app.listen(process.env.PORT);
        const io = require('./socket')(server);
        io.on('connection', socket => {
            console.log('Cliente conectado');
        });
    })
    .catch(err => console.log(err));