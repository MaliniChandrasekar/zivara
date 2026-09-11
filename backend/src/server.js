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
const Settings = require('./models/settings.model');
const { authenticate, login, hashPassword, verifyPassword } = require('./middleware/auth.middleware');

const app = express();

app.use(cors());
app.use(express.json());

const designAssetDir = path.resolve(__dirname, "../public/designs");
const customerPhotoDir = path.resolve(__dirname, "../public/customer-photos");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, done) => done(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)),
});
app.use("/api/design-assets", express.static(designAssetDir, { maxAge: "30d", immutable: true }));
app.use("/api/customer-photos", express.static(customerPhotoDir, { maxAge: "30d", immutable: true }));

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
app.post('/api/customers/upload', authenticate, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Choose a JPG, PNG or WebP image' });
    await fs.mkdir(customerPhotoDir, { recursive: true });
    const filename = `customer-${Date.now()}-${crypto.randomBytes(5).toString('hex')}.webp`;
    await sharp(req.file.buffer).rotate().resize(1600, 1600, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(customerPhotoDir, filename));
    res.status(201).json({ success: true, imageUrl: `/api/customer-photos/${filename}` });
  } catch (error) { next(error); }
});
app.get('/api/settings', async (_req, res, next) => {
  try {
    const settings = await Settings.findOneAndUpdate({}, {}, { upsert: true, new: true, setDefaultsOnInsert: true });
    res.json({ success: true, data: { address: settings.address, phone: settings.phone, hours: settings.hours } });
  } catch (error) { next(error); }
});
app.put('/api/settings', authenticate, async (req, res, next) => {
  try {
    const { address, phone, hours } = req.body;
    const settings = await Settings.findOneAndUpdate({}, { address, phone, hours }, { upsert: true, new: true, setDefaultsOnInsert: true });
    res.json({ success: true, message: 'Settings updated', data: { address: settings.address, phone: settings.phone, hours: settings.hours } });
  } catch (error) { next(error); }
});
app.put('/api/settings/password', authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    const settings = await Settings.findOneAndUpdate({}, {}, { upsert: true, new: true, setDefaultsOnInsert: true });
    const currentOk = settings.adminPasswordHash
      ? verifyPassword(currentPassword || '', settings.adminPasswordHash)
      : currentPassword === process.env.ADMIN_PASSWORD;
    if (!currentOk) return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    settings.adminPasswordHash = hashPassword(newPassword);
    await settings.save();
    res.json({ success: true, message: 'Password updated' });
  } catch (error) { next(error); }
});
app.get('/api/overview/summary', authenticate, async (_req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const activeStatuses = ['New', 'Cutting', 'Stitching', 'Trial', 'Ready'];

    const [orders, customers, newEnquiries] = await Promise.all([
      Order.find({ isDeleted: { $ne: true } }).populate('customer').sort({ createdAt: -1 }).lean(),
      Customer.find({ isDeleted: { $ne: true } }).lean(),
      Enquiry.countDocuments({ isDeleted: { $ne: true }, status: 'New', service: { $ne: 'Feedback' } }),
    ]);

    const thisMonthOrders = orders.filter((o) => new Date(o.createdAt) >= startOfMonth);
    const lastMonthOrders = orders.filter((o) => new Date(o.createdAt) >= startOfLastMonth && new Date(o.createdAt) < startOfMonth);
    const revenueThisMonth = thisMonthOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const revenueLastMonth = lastMonthOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const revenueChangePercent = revenueLastMonth ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 1000) / 10 : null;

    const activeOrders = orders.filter((o) => activeStatuses.includes(o.status));
    const dueThisWeek = activeOrders.filter((o) => o.dueDate && new Date(o.dueDate) >= now && new Date(o.dueDate) <= endOfWeek).length;
    const customersThisMonth = customers.filter((c) => new Date(c.createdAt) >= startOfMonth).length;
    const progress = activeStatuses.map((status) => ({ status, count: orders.filter((o) => o.status === status).length }));
    const recentOrders = orders.slice(0, 5).map((o) => ({
      id: o.orderNumber,
      customer: o.customer?.name || '—',
      item: o.garment,
      date: o.dueDate ? new Date(o.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—',
      amount: `₹${(o.amount || 0).toLocaleString('en-IN')}`,
      status: o.status,
    }));

    res.json({
      success: true,
      data: {
        revenueThisMonth, revenueChangePercent,
        activeOrdersCount: activeOrders.length, dueThisWeek,
        totalCustomers: customers.length, customersThisMonth,
        newEnquiries, recentOrders, progress,
      },
    });
  } catch (error) { next(error); }
});
app.get('/api/payments/summary', authenticate, async (req, res, next) => {
  try {
    const filter = { isDeleted: { $ne: true }, status: { $ne: 'Cancelled' } };
    if (req.query.from || req.query.to) {
      filter.dueDate = {};
      if (req.query.from) filter.dueDate.$gte = new Date(req.query.from);
      if (req.query.to) filter.dueDate.$lte = new Date(req.query.to + 'T23:59:59.999Z');
    }
    const orders = await Order.find(filter).populate('customer').lean();
    const totalAmount = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const totalCollected = orders.reduce((sum, o) => sum + (o.advancePaid || 0), 0);
    const due = orders
      .filter((o) => (o.amount || 0) > (o.advancePaid || 0))
      .map((o) => ({
        orderNumber: o.orderNumber,
        customer: o.customer?.name || '—',
        garment: o.garment,
        amount: o.amount || 0,
        advancePaid: o.advancePaid || 0,
        due: (o.amount || 0) - (o.advancePaid || 0),
        paymentStatus: o.paymentStatus,
        dueDate: o.dueDate,
      }))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    res.json({ success: true, data: { totalAmount, totalCollected, totalPending: totalAmount - totalCollected, orders: due } });
  } catch (error) { next(error); }
});
app.post('/api/enquiries', createResourceController(Enquiry).create);
app.use('/api/customers', resourceRoutes(Customer, '', [authenticate], ['name','phone','email']));
app.use('/api/enquiries', resourceRoutes(Enquiry, '', [authenticate], ['name','phone','service']));
app.use('/api/orders', resourceRoutes(Order, 'customer', [authenticate], ['orderNumber','garment','size'], Customer, ['name']));
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
