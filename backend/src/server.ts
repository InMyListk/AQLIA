import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/authRoute';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(authRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`serve on port ${PORT}`);
});
