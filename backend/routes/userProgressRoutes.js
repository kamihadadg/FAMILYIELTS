const express = require('express');

const router = express.Router();
const userProgressController = require('../controllers/userProgressController');
const authMiddleware = require('../middleware/auth');

router.get('/due', authMiddleware, userProgressController.getDueFlashcards);
router.post('/update', authMiddleware, userProgressController.updateProgress);
router.post('/initialize', authMiddleware, userProgressController.initializeProgress);
router.get('/stats', authMiddleware, userProgressController.getProgressStats);

module.exports = router;