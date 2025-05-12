
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const status=require('express-status-monitor')
dotenv.config();
const fs = require('fs');

const app = express();


app.use(express.json());

app.use(status());
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
  const stream = fs.createReadStream("./static.txt", "utf-8");//for memory optimization
  stream.on("data", (chunk) => {
    res.write(chunk);
  });
  stream.on("end", () => {
    res.end();
    console.log("File reading completed.");
  });
});
console.log("hebhbhiub");

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
