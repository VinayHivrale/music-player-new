const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors()); // Allow all origins

// PostgreSQL connection configuration
const pool = new Pool({
  user: "postgres",        
  host: "your-rds-endpoint",  
  database: "musicdb",       
  password: "your-password",  
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },                   
});

// POST route to accept song requests
app.post('/song-request', async (req, res) => {
  const { name, email, song, artist } = req.body;
  try {
    const queryText = "INSERT INTO song_requests (name, email, song, artist) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [name, email, song, artist];
    const result = await pool.query(queryText, values);
    res.status(200).json({ message: "Song request submitted", data: result.rows[0] });
  } catch (err) {
    console.error('Error inserting song request:', err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET route to retrieve all song requests (for admin)
app.get('/admin/song-requests', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM song_requests");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching song requests:', err);
    res.status(500).json({ error: "Database error" });
  }
});

// Serve admin HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  // Serve admin HTML page
  app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
  });
  // Serve admin HTML page
  app.get('/request', (req, res) => {
    res.sendFile(__dirname + '/request.html');
  });

// Start the server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
