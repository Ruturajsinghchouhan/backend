// server.js

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routers
import userRouter from './router/user.router.js';
import searchRouter from './router/search.route.js';

// Routes
app.use("/user", userRouter);
app.use("/search", searchRouter);

// Default route
app.get('/', (req, res) => {
  res.send("Travel Assistant API is running...");
});

// Server start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
