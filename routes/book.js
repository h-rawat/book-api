const express = require('express')
const Book = require('../models/book')
const router = express.Router()
const { validateBook } = require('../middleware/validation')

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Great Book
 *               author:
 *                 type: string
 *                 example: Jane Doe
 *               publishedYear:
 *                 type: integer
 *                 example: 2023
 *               genre:
 *                 type: string
 *                 example: Fiction
 *     responses:
 *       201:
 *         description: Book created
 *       400:
 *         description: Invalid input
 */
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

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Retrieve all books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of books
 */
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

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book found
 *       404:
 *         description: Book not found
 */
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

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Book Title
 *               author:
 *                 type: string
 *                 example: Updated Author
 *               publishedYear:
 *                 type: integer
 *                 example: 2025
 *               genre:
 *                 type: string
 *                 example: Nonfiction
 *     responses:
 *       200:
 *         description: Book updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Book not found
 */
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

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted
 *       404:
 *         description: Book not found
 */
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