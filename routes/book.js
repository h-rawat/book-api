const express = require('express')
const Book = require('../models/book')
const router = express.Router()
const { validateBook } = require('../middleware/validation')

// CREATE a new book
router.post('/', validateBook, async (req, res) => {
    try {
        const book = new Book(req.body)
        const savedBook = await book.save()
        res.status(201).json(savedBook)
    } catch (err) {
        res.status(400).json({
            error: err.message
        })
    }
})

// READ all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find()
        res.json(books)
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
})

// READ a single book
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        if (!book) {
            return res.status(404).json({
                error: 'Book not found'
            })
        }

        res.json(book)
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
})

// UPDATE a book
router.put('/:id', validateBook, async (req, res) => {
    try {
        const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })
        if (!updated) {
            return res.status(404).json({
                error: 'Book not found'
            })
        }
        res.json(updated)
    } catch (err) {
        res.status(400).json({
            error: err.message
        })
    }
})

// DELETE a book
router.delete("/:id", async (req, res) => {
    try {
        const removed = await Book.findByIdAndDelete(req.params.id)
        if (!removed) {
            return res.json(404).json({
                error: 'Book not found'
            })
        }

        res.json({
            message: 'Book deleted'
        })
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
})

module.exports = router