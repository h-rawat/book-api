const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const authMiddleware = require('./middleware/auth')
const bookRoutes = require('./routes/book')
const userRoutes = require('./routes/user')

app.use(express.json())
app.use('/api/users', userRoutes)
app.use('/api/books', authMiddleware, bookRoutes)

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(3000, () => console.log('Server started on port 3000'))
}).catch(err => {
    console.error('MongoDB connection error: ', err)
})