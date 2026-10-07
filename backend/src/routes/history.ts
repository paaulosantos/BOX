import { Router } from 'express';
import { db } from '../data/store';

const router = Router();
router.get('/', async (_req, res) => {
  try { res.json({ success: true, data: await db.getInventorySnapshots() }); }
  catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
});

export default router;
