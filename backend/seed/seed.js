const { Pool } = require('pg');
const flashcards = require('../../Data/504FullGrok.json');

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
        'INSERT INTO flashcards (id, word, pronunciation, translation, meaning, example, category, tip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING',
        [
          card.id,
          card.front.word,
          '',
          card.back.translation,
          card.back.meaning,
          card.back.example,
          card.category,
          card.back.tip
        ]
      );
      console.log('Flashcard inserted:', card.front.word);
    }
    console.log('Flashcards seeded successfully');
  } catch (error) {
    console.error('Error seeding flashcards:', error);
  } finally {
    pool.end();
  }
}

seedFlashcards();