import { Router } from 'express';
import { answerAssistant } from '../services/assistantService.js';
import { getProducts } from '../services/productService.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const message = String(req.body.message || '').trim();

    if (!message) {
      res.status(400).json({ message: 'Message is required.' });
      return;
    }

    const products = await getProducts();
    const reply = await answerAssistant({
      message,
      history: Array.isArray(req.body.history) ? req.body.history : [],
      products,
    });

    res.json({ reply });
  } catch (error) {
    next(error);
  }
});

export default router;
