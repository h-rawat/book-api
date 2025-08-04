const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')

const app = express()
const authMiddleware = require('./middleware/auth')
const bookRoutes = require('./routes/book')
const userRoutes = require('./routes/user')

app.use(express.json())
app.use('/api/users', userRoutes)
app.use('/api/books', authMiddleware, bookRoutes)

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Book Management API',
            version: '1.0.0',
            description: 'RESTful Book API with user auth'
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./routes/*.js'],
}

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(3000, () => console.log('Server started on port 3000'))
}).catch(err => {
    console.error('MongoDB connection error: ', err)
})