const express = require('express');
const router = express.Router();
const flashcardController = require('../controllers/flashcardController');
const authMiddleware = require('../middleware/auth');

router.get('/', flashcardController.getFlashcards);
router.get('/:id', flashcardController.getFlashcardById);
router.post('/', authMiddleware, flashcardController.createFlashcard);
router.put('/:id', authMiddleware, flashcardController.updateFlashcard);
router.delete('/:id', authMiddleware, flashcardController.deleteFlashcard);

module.exports = router;