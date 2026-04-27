require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const uploadCSV = require('./uploadCSV');
const studentRoutes = require('./routes');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files — absolute path use karo
app.use(express.static(path.join(__dirname, '..', 'public')));

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// Routes
app.use('/', studentRoutes);

// Server start
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  await connectDB();
  await uploadCSV();
});