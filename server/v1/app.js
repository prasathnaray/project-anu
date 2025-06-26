const express = require('express');
const app = express();
//db
const client = require('./utils/conn');
//Auth
const LoginRouter = require('./routes/Auth')

//enabling cors
const cors = require('cors');
app.use(cors());
app.listen('4004', (err) => {
    if(err)
    {
        console.log(err)
    }
    else
    {
        console.log(`Working`)
    }
})
//enables
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//Auth route
app.use('/api/v1', LoginRouter);