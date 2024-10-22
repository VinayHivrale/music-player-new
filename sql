CREATE TABLE song_requests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  song VARCHAR(255),
  artist VARCHAR(255),
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
