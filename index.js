
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();


const app = express();


app.use(express.json());


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });


const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');


app.use('/auth', authRoutes);
// app.use('/user', userRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to your Node.js authentication app!');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
