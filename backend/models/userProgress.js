const pool = require('../config/db');

const UserProgress = {
  // مقداردهی اولیه
  async initializeProgress(userId) {
    try {
      const existingProgress = await pool.query(
        'SELECT COUNT(*) FROM user_progress WHERE user_id = $1',
        [userId]
      );
      const count = parseInt(existingProgress.rows[0].count, 10);
      if (count > 0) {
        console.log(`Progress already initialized for user ${userId}, skipping.`);
        return;
      }

      await pool.query(
        `INSERT INTO user_progress (user_id, flashcard_id, is_archived)
         SELECT $1, id, FALSE
         FROM flashcards
         ON CONFLICT (user_id, flashcard_id) DO NOTHING`,
        [userId]
      );
      console.log(`Progress initialized for user ${userId}`);
    } catch (error) {
      console.error('Error initializing progress:', error);
      throw error;
    }
  },

  // گرفتن آمار
  async getProgressStats(userId) {
    const result = await pool.query(
      `SELECT 
         COUNT(*) FILTER (WHERE is_archived = FALSE) as unarchived_count,
         COUNT(*) FILTER (WHERE is_archived = TRUE) as archived_count,
         COUNT(*) as total_count
       FROM user_progress
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  },

  // گرفتن 10 فلش‌کارت تصادفی که بایگانی نشده‌اند
  async getInitialFlashcards(userId) {
    const result = await pool.query(
      `SELECT f.*, up.is_archived
       FROM flashcards f
       JOIN user_progress up ON f.id = up.flashcard_id
       WHERE up.user_id = $1 AND up.is_archived = FALSE
       ORDER BY RANDOM()
       LIMIT 10`,
      [userId]
    );
    return result.rows;
  },

  // گرفتن فلش‌کارت‌های بایگانی‌شده برای آزمون تصادفی
  async getArchivedFlashcardsForQuiz(userId) {
    const result = await pool.query(
      `SELECT f.*, up.is_archived
       FROM flashcards f
       JOIN user_progress up ON f.id = up.flashcard_id
       WHERE up.user_id = $1 AND up.is_archived = TRUE
       ORDER BY RANDOM()
       LIMIT 10`,
      [userId]
    );
    console.log(`Fetched ${result.rows.length} archived flashcards for quiz for user ${userId}`);
    return result.rows;
  },

  // بایگانی کردن یک فلش‌کارت
  async archiveFlashcard(userId, flashcardId) {
    await pool.query(
      `UPDATE user_progress
       SET is_archived = TRUE
       WHERE user_id = $1 AND flashcard_id = $2`,
      [userId, flashcardId]
    );
    console.log(`Flashcard ${flashcardId} archived for user ${userId}`);
  },

  // خارج کردن یک فلش‌کارت از بایگانی
  async unarchiveFlashcard(userId, flashcardId) {
    await pool.query(
      `UPDATE user_progress
       SET is_archived = FALSE
       WHERE user_id = $1 AND flashcard_id = $2`,
      [userId, flashcardId]
    );
    console.log(`Flashcard ${flashcardId} unarchived for user ${userId}`);
  },

  // بررسی اینکه آیا هنوز فلش‌کارت بایگانی‌نشده وجود دارد یا نه
  async hasUnarchivedFlashcards(userId) {
    const result = await pool.query(
      `SELECT EXISTS (
         SELECT 1 FROM user_progress 
         WHERE user_id = $1 AND is_archived = FALSE
       ) as has_unarchived`,
      [userId]
    );
    return result.rows[0].has_unarchived;
  },
};

module.exports = UserProgress;