import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const app = express();
const port = process.env.PORT || 4000;
const clientUrls = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : true;

app.use(cors({ origin: clientUrls }));
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'my-e-comm-api' });
});

app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong',
  });
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
