const Flashcard = require('../models/flashcard');

exports.getFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.getAll();
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getFlashcardById = async (req, res) => {
  try {
    const flashcard = await Flashcard.getById(req.params.id);
    if (!flashcard) return res.status(404).json({ error: 'Flashcard not found' });
    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.create({ ...req.body, user_id: req.user.id });
    res.status(201).json(flashcard);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.update(req.params.id, req.body);
    if (!flashcard) return res.status(404).json({ error: 'Flashcard not found' });
    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteFlashcard = async (req, res) => {
  try {
    await Flashcard.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};