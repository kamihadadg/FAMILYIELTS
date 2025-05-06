const UserProgress = require('../models/userProgress');

exports.getDueFlashcards = async (req, res) => {
  try {
    const flashcards = await UserProgress.getDueFlashcards(req.user.id, req.query.limit || 10);
    res.json(flashcards);
  } catch (error) {
    console.error('Error fetching due flashcards:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProgress = async (req, res) => {
  const { flashcardId, score } = req.body;
  try {
    const progress = await UserProgress.updateProgress(req.user.id, flashcardId, score);
    res.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.initializeProgress = async (req, res) => {
  try {
    await UserProgress.initializeProgress(req.user.id);
    res.status(201).json({ message: 'Progress initialized' });
  } catch (error) {
    console.error('Error initializing progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.getProgressStats = async (req, res) => {
    try {
      const stats = await UserProgress.getProgressStats(req.user.id);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching progress stats:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };