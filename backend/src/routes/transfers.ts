import { Router, Request, Response } from 'express';
import { db } from '../data/store';

const router = Router();

// GET /api/transfers
router.get('/', (_req: Request, res: Response) => {
  try {
    const transfers = db.getTransfers();
    res.json({ success: true, data: transfers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/transfers
router.post('/', (req: Request, res: Response) => {
  try {
    const {
      code,
      description,
      productName,
      quantity,
      originBranch,
      destinationBranch,
      driver,
      plate,
      eta
    } = req.body;

    const trfCode = code || `TRF-2024-${Math.floor(100 + Math.random() * 900)}`;
    const newTrf = db.addTransfer({
      code: trfCode,
      description: description || `${quantity || 1}x ${productName || 'Item'}`,
      productName: productName || 'Item',
      quantity: Number(quantity) || 1,
      originBranch: originBranch || 'Matriz SP',
      destinationBranch: destinationBranch || 'CD Curitiba',
      status: 'Em Separação',
      progressPercent: 15,
      eta: eta || 'Amanhã 10:00',
      trackingCode: `BR-LOG-${Math.floor(1000000 + Math.random() * 9000000)}`,
      driver: driver || 'Motorista Parceiro',
      plate: plate || 'ABC-1234'
    });

    res.status(201).json({ success: true, data: newTrf });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/transfers/:id/complete
router.patch('/:id/complete', (req: Request, res: Response) => {
  try {
    const completed = db.completeTransfer(req.params.id);
    if (!completed) {
      return res.status(404).json({ success: false, message: 'Transferência não encontrada' });
    }

    res.json({
      success: true,
      message: 'Transferência concluída com sucesso',
      data: completed
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
