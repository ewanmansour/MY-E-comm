import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../services/productService.js';
import { normalizeProductPayload, validateProduct } from '../utils/validation.js';
import { saveUploadedImage } from '../services/uploadService.js';

const router = Router();

router.use(adminAuth);

router.get('/products', async (req, res, next) => {
  try {
    const products = await getProducts({ includeInactive: true });
    res.json({ products });
  } catch (error) {
    next(error);
  }
});

router.put('/products/:id', async (req, res, next) => {
  try {
    const productPayload = normalizeProductPayload(req.body);
    const errors = validateProduct(productPayload);

    if (errors.length > 0) {
      res.status(400).json({ message: `Invalid product payload: ${errors.join(' ')}`, errors });
      return;
    }

    const product = await updateProduct(req.params.id, productPayload);

    if (!product) {
      res.status(404).json({ message: 'Product not found.' });
      return;
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
});

router.post('/products', async (req, res, next) => {
  try {
    const productPayload = normalizeProductPayload(req.body);
    const errors = validateProduct(productPayload);

    if (errors.length > 0) {
      res.status(400).json({ message: `Invalid product payload: ${errors.join(' ')}`, errors });
      return;
    }

    const product = await createProduct(productPayload);
    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
});

router.post('/upload', async (req, res, next) => {
  try {
    const imageUrl = await saveUploadedImage(req.body);
    res.status(201).json({ imageUrl });
  } catch (error) {
    error.status = error.status || 400;
    next(error);
  }
});

router.delete('/products/:id', async (req, res, next) => {
  try {
    const deleted = await deleteProduct(req.params.id);

    if (!deleted) {
      res.status(404).json({ message: 'Product not found.' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
