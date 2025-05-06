

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

CREATE TABLE user_progress (
  user_id INTEGER NOT NULL REFERENCES users(id),
  flashcard_id INTEGER NOT NULL REFERENCES flashcards(id),
  interval INTEGER NOT NULL,
  easiness DOUBLE PRECISION NOT NULL,
  repetitions INTEGER NOT NULL,
  next_review_date TIMESTAMP WITH TIME ZONE NOT NULL,
  last_reviewed TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL,
  PRIMARY KEY (user_id, flashcard_id)
);

CREATE TABLE flashcards (
  id SERIAL PRIMARY KEY,
  word VARCHAR(100) NOT NULL,
  pronunciation VARCHAR(100),
  translation VARCHAR(100) NOT NULL,
  meaning TEXT,
  example TEXT,
  tip TEXT,
  category VARCHAR(50),
  user_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create progress table
CREATE TABLE progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  flashcard_id INTEGER REFERENCES flashcards(id),
  reviewed BOOLEAN DEFAULT FALSE,
  mastered BOOLEAN DEFAULT FALSE
);

