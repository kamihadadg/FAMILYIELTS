const express = require('express');
const router = express.Router();
const userProgressController = require('../controllers/userProgressController');
const authMiddleware = require('../middleware/auth');

router.post('/initialize', authMiddleware, userProgressController.initializeProgress);
router.get('/stats', authMiddleware, userProgressController.getProgressStats);
router.get('/initial', authMiddleware, userProgressController.getInitialFlashcards);
router.get('/quiz', authMiddleware, userProgressController.getArchivedFlashcardsForQuiz);
router.post('/archive', authMiddleware, userProgressController.archiveFlashcard);
router.post('/unarchive', authMiddleware, userProgressController.unarchiveFlashcard);
router.get('/has-unarchived', authMiddleware, userProgressController.hasUnarchivedFlashcards);

module.exports = router;