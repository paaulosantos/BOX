import { Router, Request, Response } from 'express';
import { db } from '../data/store';

const router = Router();

// GET /api/movements
router.get('/', (req: Request, res: Response) => {
  try {
    const { branch } = req.query;
    const movements = db.getMovements(typeof branch === 'string' ? branch : undefined);
    res.json({ success: true, data: movements });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/movements
router.post('/', (req: Request, res: Response) => {
  try {
    const {
      productName,
      sku,
      origin,
      destination,
      operationType,
      quantity,
      unit,
      responsibleName,
      branch
    } = req.body;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newMov = db.addMovement({
      timestamp: 'Hoje ' + timeStr,
      time: timeStr,
      productName: productName || 'Produto sem nome',
      sku: sku || 'SEM-SKU',
      origin: origin || 'Almoxarifado',
      destination: destination || 'Destino',
      operationType: operationType || 'Ajuste Inventário',
      quantity: Number(quantity) || 0,
      unit: unit || 'un',
      responsibleName: responsibleName || 'Operador',
      responsibleAvatar: 'https://lh3.googleusercontent.com/a/ACg8ocL_user4_avatar',
      branch: branch || 'matriz'
    });

    res.status(201).json({ success: true, data: newMov });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
