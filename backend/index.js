const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load .env variables

const app = express();
const Routes = require("./routes/route.js");

const port = process.env.PORT || 5000;

app.use(express.json({ limit: '10mb' }));

// More robust CORS configuration for Vercel deployment
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Default to common Vite dev port
  credentials: true,
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log("NOT CONNECTED TO NETWORK", err);
});

// Use a more standard /api prefix for all routes
app.use('/api', Routes);

// Default API route for health check
app.get('/', (req, res) => {
  res.send("API is live 🚀");
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// Start server
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
