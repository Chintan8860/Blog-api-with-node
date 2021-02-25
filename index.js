const express = require('express')
const app = express()
const port = 3000

require('./dataBase/mongoose')

app.use(express.json())

app.use(require('./routers/auth'));
app.use(require('./routers/topic'));
app.use(require('./routers/post'));
app.use(require('./routers/like'));
app.use(require('./routers/comment'));


app.get('*', (req, res) => {
    res.send({ error: "Page not Found" })
})

app.listen(port, () => {
    console.log('Server is on !!!', port)
})
