import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/user.js';
import AIRoute from './routes/ai.js';

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());

app.use(cors({
  origin: "*"
}));

app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      express.json()(req, res, next);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  } else {
    next();
  }
});



// Connect to MongoDB
const db = process.env.MONGU_URI;

mongoose.connect(db)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((errdb) => {
    console.log("DB connection error:", errdb);
  });




// Routes for user and AI jobs
app.use('/api/user', userRoute);
app.use('/api/job', AIRoute);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
