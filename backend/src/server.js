const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const customerRoutes = require("./routes/customer.routes");
const resourceRoutes = require('./routes/resource.routes');
const createResourceController = require('./controllers/resource.controller');
const Enquiry = require('./models/enquiry.model');
const Order = require('./models/order.model');
const Appointment = require('./models/appointment.model');
const { authenticate, login } = require('./middleware/auth.middleware');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.post('/api/auth/login', login);
app.get('/api/auth/me', authenticate, (req, res) => res.json({ success: true, user: req.user }));
app.post('/api/enquiries', createResourceController(Enquiry).create);
app.use("/api/customers", authenticate, customerRoutes);
app.use('/api/enquiries', resourceRoutes(Enquiry, '', [authenticate]));
app.use('/api/orders', resourceRoutes(Order, 'customer', [authenticate]));
app.use('/api/appointments', resourceRoutes(Appointment, '', [authenticate]));
app.get('/api/health', (_req, res) => res.json({ success: true, service: 'Zivara API' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Something went wrong' });
});

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
