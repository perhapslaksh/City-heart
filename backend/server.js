require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const app = express();

app.use(cors({
  origin: 'https://heartyourcity.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.options('*', cors({
  origin: 'https://heartyourcity.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/places',        require('./routes/places'));
app.use('/api/lists',         require('./routes/lists'));
app.use('/api/feed',          require('./routes/feed'));
app.use('/api/cities',        require('./routes/cities'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/upload',        require('./routes/upload'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://perhapslaksh_db_user:1iemG9fP6EWAAq4r@laksh.mb4gtqw.mongodb.net/Cityheart')
  .then(() => { console.log('MongoDB connected'); app.listen(PORT, () => console.log(`Server on :${PORT}`)); })
  .catch(err => { console.error('DB error:', err); process.exit(1); });
