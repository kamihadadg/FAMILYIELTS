const pool = require('../config/db');

const Flashcard = {
  async getAll() {
    const result = await pool.query('SELECT * FROM flashcards');
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM flashcards WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create(data) {
    const { word, pronunciation, translation, meaning, example, tip, category, user_id } = data;
    const result = await pool.query(
      'INSERT INTO flashcards (word, pronunciation, translation, meaning, example, tip, category, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [word, pronunciation, translation, meaning, example, tip, category, user_id]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { word, pronunciation, translation, meaning, example, tip, category } = data;
    const result = await pool.query(
      'UPDATE flashcards SET word = $1, pronunciation = $2, translation = $3, meaning = $4, example = $5, tip = $6, category = $7 WHERE id = $8 RETURNING *',
      [word, pronunciation, translation, meaning, example, tip, category, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM flashcards WHERE id = $1', [id]);
  },
};

module.exports = Flashcard;