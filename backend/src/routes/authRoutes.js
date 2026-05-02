import { Router } from 'express';
import { login, signup, validateAuthPayload } from '../services/authService.js';

const router = Router();

router.post('/signup', async (req, res, next) => {
  try {
    const errors = validateAuthPayload(req.body, true);

    if (errors.length > 0) {
      res.status(400).json({ message: 'Invalid signup data.', errors });
      return;
    }

    const auth = await signup(req.body);
    res.status(201).json(auth);
  } catch (error) {
    if (error.code === '23505') {
      res.status(409).json({ message: 'This email is already registered.' });
      return;
    }

    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const errors = validateAuthPayload(req.body);

    if (errors.length > 0) {
      res.status(400).json({ message: 'Invalid login data.', errors });
      return;
    }

    const auth = await login(req.body);
    res.json(auth);
  } catch (error) {
    next(error);
  }
});

export default router;
