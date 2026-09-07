const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs/promises");
const crypto = require("crypto");
const multer = require("multer");
const sharp = require("sharp");
require("dotenv").config();

const resourceRoutes = require('./routes/resource.routes');
const createResourceController = require('./controllers/resource.controller');
const Enquiry = require('./models/enquiry.model');
const Order = require('./models/order.model');
const Appointment = require('./models/appointment.model');
const Customer = require('./models/customer.model');
const Design = require('./models/design.model');
const Service = require('./models/service.model');
const { authenticate, login } = require('./middleware/auth.middleware');

const app = express();

app.use(cors());
app.use(express.json());

const designAssetDir = path.resolve(__dirname, "../public/designs");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, done) => done(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)),
});
app.use("/api/design-assets", express.static(designAssetDir, { maxAge: "30d", immutable: true }));

// Routes
app.post('/api/auth/login', login);
app.get('/api/auth/me', authenticate, (req, res) => res.json({ success: true, user: req.user }));
app.get('/api/showcase-designs', async (_req, res, next) => {
  try {
    let local = [];
    try { local = JSON.parse(await fs.readFile(path.join(designAssetDir, "manifest.json"), "utf8")); } catch {}
    const managed = await Design.find({ status: "Published", isDeleted: false, imageUrl: { $ne: "" } }).sort({ featured: -1, createdAt: -1 }).lean();
    const categoryNames = { Blouse: 'Pattern Blouse', 'Aari work': 'Aari Work', Elb: 'Embroidery Work' };
    const normalize = item => ({ ...item, category: categoryNames[item.category] || item.category });
    res.json({ success: true, data: [...managed.map(item => normalize({ ...item, id: item._id })), ...local.map(normalize)] });
  } catch (error) { next(error); }
});
app.post('/api/designs/upload', authenticate, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Choose a JPG, PNG or WebP image' });
    await fs.mkdir(designAssetDir, { recursive: true });
    const filename = `upload-${Date.now()}-${crypto.randomBytes(5).toString('hex')}.webp`;
    await sharp(req.file.buffer).rotate().resize(1200, 1500, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(designAssetDir, filename));
    res.status(201).json({ success: true, imageUrl: `/api/design-assets/${filename}` });
  } catch (error) { next(error); }
});
app.post('/api/enquiries', createResourceController(Enquiry).create);
app.use('/api/customers', resourceRoutes(Customer, '', [authenticate], ['name','phone','email']));
app.use('/api/enquiries', resourceRoutes(Enquiry, '', [authenticate], ['name','phone','service']));
app.use('/api/orders', resourceRoutes(Order, 'customer', [authenticate], ['orderNumber','garment','size']));
app.use('/api/appointments', resourceRoutes(Appointment, '', [authenticate], ['customerName','phone','type']));
app.use('/api/designs', resourceRoutes(Design, '', [authenticate], ['name','category','code']));
app.use('/api/services', resourceRoutes(Service, '', [authenticate], ['name','category']));
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
