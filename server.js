const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require("fs");
const bodyParser = require('body-parser');
const userRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
require("dotenv").config();

const configPath = './config/staging.json'; // Adjust path if needed
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
process.env.JWT_SECRET = config.JWT_SECRET;
// console.log("JWT Secret:", process.env.JWT_SECRET); // Debugging
// console.log(__dirname);
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todo-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes

// app.use('/api/tasks', taskRoutes);
app.use('/api',userRoutes);
app.use('/api/users',userRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/authRoutes'));
app.use('/api', require('./routes/taskRoutes'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  