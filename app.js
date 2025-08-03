const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const bookRoutes = require('./routes/book')

app.use(express.json())
app.use('/api/books', bookRoutes)

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(3000, () => console.log('Server started on port 3000'))
}).catch(err => {
    console.error('MongoDB connection error: ', err)
})