import { Router } from 'express';
import { pool } from '../db/pool.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const message = String(req.body.message || '').trim();

    if (!name || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || !message) {
      res.status(400).json({ message: 'Name, valid email, and message are required.' });
      return;
    }

    await pool.query(
      'INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message],
    );

    res.status(201).json({ message: 'Message sent successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
