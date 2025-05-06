const pool = require('../config/db');

const UserProgress = {
  async getDueFlashcards(userId) {
    const result = await pool.query(
      `SELECT DISTINCT f.*, up.interval, up.easiness, up.repetitions, up.next_review_date, up.status
       FROM flashcards f
       JOIN user_progress up ON f.id = up.flashcard_id
       WHERE up.user_id = $1 AND up.next_review_date <= CURRENT_TIMESTAMP
       ORDER BY up.next_review_date`,
      [userId]
    );
    return result.rows;
  },

  async updateProgress(userId, flashcardId, score) {
    if (!Number.isInteger(score) || score < 0 || score > 3) {
      throw new Error('Score must be an integer between 0 and 3');
    }

    const progress = await pool.query(
      'SELECT interval, easiness, repetitions, last_reviewed FROM user_progress WHERE user_id = $1 AND flashcard_id = $2',
      [userId, flashcardId]
    );

    let { interval, easiness, repetitions, last_reviewed } = progress.rows[0] || {
      interval: 1,
      easiness: 2.5,
      repetitions: 0,
      last_reviewed: new Date(),
    };

    // الگوریتم SM2
    easiness = Math.max(1.3, easiness + (0.1 - (3 - score) * (0.08 + (3 - score) * 0.02)));
    repetitions = score < 1 ? 0 : repetitions + 1;

    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easiness);
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    const status = score >= 3 && repetitions >= 3 ? 'mastered' : score < 1 ? 'new' : 'learning';

    await pool.query(
      `INSERT INTO user_progress (user_id, flashcard_id, interval, easiness, repetitions, next_review_date, last_reviewed, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (user_id, flashcard_id)
       DO UPDATE SET
         interval = $3,
         easiness = $4,
         repetitions = $5,
         next_review_date = $6,
         last_reviewed = $7,
         status = $8`,
      [userId, flashcardId, interval, easiness, repetitions, nextReviewDate, new Date(), status]
    );

    console.log(`Updated progress for user ${userId}, flashcard ${flashcardId}: score=${score}, interval=${interval}, easiness=${easiness}, repetitions=${repetitions}, status=${status}`);
    return { interval, easiness, repetitions, nextReviewDate, status };
  },

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
        `INSERT INTO user_progress (user_id, flashcard_id, interval, easiness, repetitions, next_review_date, status)
         SELECT $1, id, 1, 2.5, 0, CURRENT_TIMESTAMP, 'new'
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

  async getProgressStats(userId) {
    const result = await pool.query(
      `SELECT 
         COUNT(*) FILTER (WHERE status = 'new') as new_count,
         COUNT(*) FILTER (WHERE status = 'learning') as learning_count,
         COUNT(*) FILTER (WHERE status = 'mastered') as mastered_count,
         COUNT(*) as total_count
       FROM user_progress
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  },
};

module.exports = UserProgress;