import { Router } from 'express';
import { userAuth } from '../middleware/userAuth.js';
import { createOrder, getOrdersByUser } from '../services/orderService.js';

const router = Router();

router.use(userAuth);

router.get('/', async (req, res, next) => {
  try {
    const orders = await getOrdersByUser(req.user.id);
    res.json({ orders });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const order = await createOrder(req.user.id, req.body);
    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
});

export default router;
