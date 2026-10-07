import { Router, Request, Response } from 'express';
import { db } from '../data/store';
import type { StagedInvoice } from '../types';

const router = Router();

// GET /api/invoices - List invoices
router.get('/', async (_req: Request, res: Response) => {
  try {
    const invoices = await db.getInvoices();
    res.json({ success: true, data: invoices });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/invoices/staged - Current XML import in staging
router.get('/staged', async (_req: Request, res: Response) => {
  try {
    const staged = await db.getStagedInvoice();
    res.json({ success: true, data: staged });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/invoices/staged/link-sku - Link SKU to staged item
router.post('/staged/link-sku', async (req: Request, res: Response) => {
  try {
    const { itemId, sku } = req.body;
    if (!itemId || !sku) {
      return res.status(400).json({ success: false, message: 'itemId e sku são obrigatórios' });
    }

    const updated = await db.linkStagedItemSku(itemId, sku);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Nenhuma nota em estágio encontrada' });
    }

    res.json({ success: true, message: 'SKU vinculado com sucesso', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/invoices/staged - persist XML data parsed by the browser
router.post('/staged', async (req: Request, res: Response) => {
  try {
    const staged = req.body as StagedInvoice;
    if (!staged?.invoiceNumber || !Array.isArray(staged.items)) return res.status(400).json({ success:false, message:'XML inválido ou sem itens.' });
    await db.setStagedInvoice(staged);
    res.status(201).json({ success:true, data:staged });
  } catch (error:any) { res.status(500).json({success:false,message:error.message}); }
});

// POST /api/invoices/staged/confirm - Confirm XML entry into physical inventory
router.post('/staged/confirm', async (req: Request, res: Response) => {
  try {
    const staged = req.body.staged || await db.getStagedInvoice();
    if (!staged) {
      return res.status(400).json({ success: false, message: 'Nenhuma nota staged para confirmar' });
    }

    const result = await db.confirmXmlEntry(staged);
    res.json({
      success: true,
      message: 'Entrada confirmada e estoque atualizado',
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/invoices - Emit new NF-e / NFC-e
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      docType,
      partyName,
      taxId,
      amount,
      series,
      type
    } = req.body;

    const now = new Date();
    const dateStr = now.toLocaleString('pt-BR');

    const newInv = await db.addInvoice({
      number: req.body.number || `RASCUNHO-${Date.now()}`,
      series: series || 'Série 1',
      type: type || 'Saída',
      docType: docType || 'NF-e',
      partyName: partyName || 'Consumidor Final',
      taxId: taxId || '',
      date: dateStr,
      amount: Number(amount) || 0,
      status: 'Processando',
      accessKey: req.body.accessKey || '',
      xmlAvailable: false
    });

    res.status(201).json({
      success: true,
      message: 'Documento salvo como rascunho; transmissão SEFAZ não configurada.',
      data: newInv
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/invoices/consult-key - Consult key in SEFAZ
router.post('/consult-key', async (req: Request, res: Response) => {
  try {
    const { key } = req.body;
    if (!key) {
      return res.status(400).json({ success: false, message: 'Chave de acesso é obrigatória' });
    }

    const cleanKey = key.replace(/\D/g, '');
    if (cleanKey.length !== 44) {
      return res.status(400).json({ success: false, message: 'Chave de acesso deve conter 44 dígitos' });
    }

    res.json({
      success: true,
      data: {
        accessKey: key,
        status: 'Consulta indisponível',
        message: 'A integração de consulta à SEFAZ não está configurada neste sistema.'
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/invoices/:id/xml - return the original XML that was imported
router.get('/:id/xml', async (req: Request, res: Response) => {
  try {
    const invoice = await db.getInvoice(req.params.id);
    if (!invoice) return res.status(404).json({success:false,message:'Nota fiscal não encontrada'});
    if (!invoice.xmlContent) return res.status(404).json({success:false,message:'O XML original não está armazenado para esta nota.'});
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${invoice.number.replace(/[^a-zA-Z0-9_-]/g, '_')}.xml"`);
    res.send(invoice.xmlContent);
  } catch (error: any) { res.status(500).json({success:false,message:error.message}); }
});

export default router;
