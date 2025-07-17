const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const Routes = require("./routes/route.js");

const port = process.env.PORT || 5000;

app.use(express.json({ limit: '10mb' }));
app.use(cors());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log("NOT CONNECTED TO NETWORK", err);
});

// The change is here: We remove the '/api' prefix.
// Vercel's routing already handles the /api part.
app.use('/', Routes);

// Health check for the root of the serverless function
app.get('/api', (req, res) => {
  res.send("Backend API is live 🚀");
});


app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
