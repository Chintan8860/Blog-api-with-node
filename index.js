//Defult Header
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

//db import
require('./dataBase/mongoose')

//middleware
app.use(express.json())

//Router
const authRoute = require('./routers/auth')
const postRoute = require('./routers/post')


//Route middleWares
app.use(authRoute);
app.use(postRoute);


//server on
app.listen(port, () => {
    console.log('Server is on !!!', port)
})
