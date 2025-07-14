const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const app = express()
const Routes = require("./routes/route.js")
const port =3000

dotenv.config();

app.use(express.json({ limit: '10mb' }))
app.use(cors())

mongoose.connect(process.env.MONGO_URI)
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))

app.use('/route', Routes);

// Add this before app.listen
app.get('/', (req, res) => {
  res.send("API is live 🚀");
});


app.listen(3000, () => {
    console.log("Server started at port no.3000");
})

// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// require('dotenv').config(); // Load environment variables

// const app = express();
// app.use(cors()); // Allow cross-origin requests
// app.use(express.json());

// // connect to MongoDB
// mongoose.connect(process.env.MONGODB_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('Connected to MongoDB');
// }).catch((error) => {
//   console.error('MongoDB connection error:', error);
// });

// app.listen(3000, () => console.log("Server started at port no.3000"));
