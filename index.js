const express = require('express')
const app = express()
const port = process.env.PORT || 3000

require('./dataBase/mongoose')

app.use(express.json())

const authRoute = require('./routers/auth')
const topicRoute = require('./routers/topic')
const postRoute = require('./routers/post')

app.use(authRoute);
app.use(topicRoute);
app.use(postRoute);


app.listen(port, () => {
    console.log('Server is on !!!', port)
})
