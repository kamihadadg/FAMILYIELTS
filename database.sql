-- Create database (run this in PostgreSQL client first)
CREATE DATABASE flashcards_db;

-- Connect to the database
\c flashcards_db

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

-- Create flashcards table
CREATE TABLE flashcards (
  id SERIAL PRIMARY KEY,
  word VARCHAR(100) NOT NULL,
  pronunciation VARCHAR(100),
  translation VARCHAR(100) NOT NULL,
  meaning TEXT,
  example TEXT,
  tip TEXT,
  category VARCHAR(50),
  user_id INTEGER REFERENCES users(id)
);

-- Create progress table
CREATE TABLE progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  flashcard_id INTEGER REFERENCES flashcards(id),
  reviewed BOOLEAN DEFAULT FALSE,
  mastered BOOLEAN DEFAULT FALSE
);

-- Insert initial flashcards (sample of 5 for brevity; full 50 in seed.js)
INSERT INTO flashcards (word, pronunciation, translation, meaning, example, tip, category) VALUES
('obviously', '/ˈɒb.vi.əs.li/', 'بدیهی است', 'برای تأکید روی چیزی که واضح یا قابل انتظاره.', 'Obviously, living in a big city has its challenges.', 'سعی کن از این عبارت در Part 3 برای تأکید روی نظرت استفاده کنی. حالا یه جمله با obviously درباره محل زندگیت بگو!', 'Discourse Marker'),
('actually', '/ˈæk.tʃu.ə.li/', 'در واقع', 'برای اصلاح یا توضیح چیزی که ممکنه غافلگیرکننده باشه.', 'Actually, I prefer working from home.', 'با یکی از اعضای خانواده درباره یه ترجیح غیرمنتظره با actually صحبت کن!', 'Discourse Marker'),
('you know', '/juː noʊ/', 'میدونی', 'برای پر کردن مکث یا جلب توجه مخاطب.', 'I love traveling, you know, it broadens your mind.', 'زیاد ازش استفاده نکن! یه جمله درباره سرگرمی‌ت با you know بگو.', 'Filler'),
('like', '/laɪk/', 'مثل اینکه', 'برای پر کردن مکث یا غیررسمی کردن صحبت.', 'It’s, like, really hard to find a good job these days.', 'فقط در Part 1 یا مکالمات غیررسمی استفاده کن. درباره یه چالش روزمره با like حرف بزن!', 'Filler'),
('basically', '/ˈbeɪ.sɪ.kli/', 'اساساً', 'برای خلاصه کردن یا ساده کردن یه ایده.', 'Basically, I think education should be free.', 'یه نظر درباره یه موضوع اجتماعی با basically خلاصه کن.', 'Discourse Marker');