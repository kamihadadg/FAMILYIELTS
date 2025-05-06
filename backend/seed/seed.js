const { Pool } = require('pg');
const flashcards = require('../../Data/IELTS_Speaking.json');

// تنظیمات دیتابیس مستقیماً در فایل
const pool = new Pool({
  user: 'postgres', // نام کاربر دیتابیس
  host: 'localhost', // هاست دیتابیس
  database: 'ielts', // نام دیتابیس
  password: 'K@mran123', // رمز عبور دیتابیس (این را با رمز واقعی جایگزین کنید)
  port: 5432, // پورت دیتابیس
});

async function seedFlashcards() {
  try {
    // لاگ کردن تعداد فلش‌کارت‌ها برای دیباگ
    console.log('Number of flashcards:', flashcards.length);
    // لاگ کردن یک نمونه فلش‌کارت
    console.log('Sample flashcard:', JSON.stringify(flashcards[0], null, 2));

    for (const card of flashcards) {
      await pool.query(
        'INSERT INTO flashcards (word, translation, example, category) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [card.word, card.translation, card.example, card.category]
      );
    }
    console.log('Flashcards seeded successfully');
  } catch (error) {
    console.error('Error seeding flashcards:', error);
  } finally {
    pool.end();
  }
}

seedFlashcards();