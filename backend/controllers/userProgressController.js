const UserProgress = require('../models/userProgress');

exports.initializeProgress = async (req, res) => {
  try {
    await UserProgress.initializeProgress(req.user.id);
    res.status(200).json({ message: 'Progress initialized' });
  } catch (error) {
    res.status(500).json({ message: 'Error initializing progress', error });
  }
};

exports.getProgressStats = async (req, res) => {
  try {
    const stats = await UserProgress.getProgressStats(req.user.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error });
  }
};

exports.getInitialFlashcards = async (req, res) => {
  try {
    const flashcards = await UserProgress.getInitialFlashcards(req.user.id);
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching initial flashcards', error });
  }
};

exports.getArchivedFlashcardsForQuiz = async (req, res) => {
  try {
    const flashcards = await UserProgress.getArchivedFlashcardsForQuiz(req.user.id);
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz flashcards', error });
  }
};

exports.archiveFlashcard = async (req, res) => {
  const { flashcardId } = req.body;
  try {
    await UserProgress.archiveFlashcard(req.user.id, flashcardId);
    res.status(200).json({ message: 'Flashcard archived' });
  } catch (error) {
    res.status(500).json({ message: 'Error archiving flashcard', error });
  }
};

exports.unarchiveFlashcard = async (req, res) => {
  const { flashcardId } = req.body;
  try {
    await UserProgress.unarchiveFlashcard(req.user.id, flashcardId);
    res.status(200).json({ message: 'Flashcard unarchived' });
  } catch (error) {
    res.status(500).json({ message: 'Error unarchiving flashcard', error });
  }
};

exports.hasUnarchivedFlashcards = async (req, res) => {
  try {
    const hasUnarchived = await UserProgress.hasUnarchivedFlashcards(req.user.id);
    res.json({ has_unarchived: hasUnarchived });
  } catch (error) {
    res.status(500).json({ message: 'Error checking unarchived flashcards', error });
  }
};