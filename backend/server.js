const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      if (err.code === 'ENOENT') {
        res.status(404).send('File not found.');
      } else {
        res.status(500).send('Error serving file.');
      }
    }
  });
});
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/homework', require('./routes/homeworkRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.get('/', (req, res) => {
  res.send('Student-Faculty Management Portal API is Running!');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));