import { Router, Request, Response } from 'express';
import { db } from '../data/store';

const router = Router();

// GET /api/products
router.get('/', (req: Request, res: Response) => {
  try {
    const { search, category, status } = req.query;
    let products = db.getProducts();

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (category && typeof category === 'string' && category !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (status && typeof status === 'string' && status !== 'all') {
      products = products.filter(p => p.status === status);
    }

    res.json({ success: true, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/products
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, sku, category, stock, unit, minStock, costPrice, salePrice, ncm, icms, cfop } = req.body;

    if (!name || !sku) {
      return res.status(400).json({ success: false, message: 'Nome e SKU são obrigatórios' });
    }

    const newStock = Number(stock) || 0;
    const newProduct = db.addProduct({
      name,
      sku,
      category: category || 'Geral',
      stock: newStock,
      unit: unit || 'un',
      minStock: Number(minStock) || 10,
      costPrice: Number(costPrice) || 0,
      salePrice: Number(salePrice) || 0,
      status: newStock > 20 ? 'ok' : newStock > 0 ? 'low' : 'out',
      icon: 'box',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      ncm: ncm || '8542.31.90',
      icms: icms || '18%',
      cfop: cfop || '5102'
    });

    res.status(201).json({ success: true, data: newProduct });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/products/:id/stock - Stock Adjustment
router.patch('/:id/stock', (req: Request, res: Response) => {
  try {
    const { newStock, reason, observation } = req.body;

    if (newStock === undefined || newStock === null) {
      return res.status(400).json({ success: false, message: 'Novo saldo é obrigatório' });
    }

    const result = db.adjustProductStock(
      req.params.id,
      Number(newStock),
      reason || 'inventario',
      observation || ''
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }

    res.json({
      success: true,
      message: 'Ajuste de estoque concluído com sucesso',
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/products/:id/fiscal - Update NCM, ICMS, CFOP
router.patch('/:id/fiscal', (req: Request, res: Response) => {
  try {
    const { ncm, icms, cfop } = req.body;

    const updated = db.updateProductFiscal(
      req.params.id,
      ncm || '',
      icms || '',
      cfop || ''
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }

    res.json({
      success: true,
      message: 'Ficha fiscal atualizada com sucesso',
      data: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
