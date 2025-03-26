const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require("fs");
const bodyParser = require('body-parser');
const userRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Load the config file correctly
const configPath = './config/staging.json'; // Ensure the path is correct
if (fs.existsSync(configPath)) {
  const configData = fs.readFileSync(configPath, 'utf-8');
  const config = JSON.parse(configData);
  process.env.JWT_SECRET = config.JWT_SECRET;
  process.env.MONGO_URI = config.MONGO_URI;
} else {
  console.error("Config file not found:", configPath);
  process.exit(1); // Stop the app if config is missing
}

const mongoURI = process.env.MONGO_URI;
console.log("mongoURI:", mongoURI);
console.log("JWT Secret:", process.env.JWT_SECRET);

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/taskRoutes'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
