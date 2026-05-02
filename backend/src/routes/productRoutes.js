import { Router } from 'express';
import { getProductById, getProducts } from '../services/productService.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const products = await getProducts();
    res.json({ products });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found.' });
      return;
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
});

export default router;
