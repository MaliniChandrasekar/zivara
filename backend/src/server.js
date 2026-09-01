const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const customerRoutes = require("./routes/customer.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/customers", customerRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });