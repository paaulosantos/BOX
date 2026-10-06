import { Router, Request, Response } from 'express';
import { db } from '../data/store';

const router = Router();

// GET /api/invoices - List invoices
router.get('/', (_req: Request, res: Response) => {
  try {
    const invoices = db.getInvoices();
    res.json({ success: true, data: invoices });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/invoices/staged - Current XML import in staging
router.get('/staged', (_req: Request, res: Response) => {
  try {
    const staged = db.getStagedInvoice();
    res.json({ success: true, data: staged });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/invoices/staged/link-sku - Link SKU to staged item
router.post('/staged/link-sku', (req: Request, res: Response) => {
  try {
    const { itemId, sku } = req.body;
    if (!itemId || !sku) {
      return res.status(400).json({ success: false, message: 'itemId e sku são obrigatórios' });
    }

    const updated = db.linkStagedItemSku(itemId, sku);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Nenhuma nota em estágio encontrada' });
    }

    res.json({ success: true, message: 'SKU vinculado com sucesso', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/invoices/staged/confirm - Confirm XML entry into physical inventory
router.post('/staged/confirm', (req: Request, res: Response) => {
  try {
    const staged = req.body.staged || db.getStagedInvoice();
    if (!staged) {
      return res.status(400).json({ success: false, message: 'Nenhuma nota staged para confirmar' });
    }

    const result = db.confirmXmlEntry(staged);
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
router.post('/', (req: Request, res: Response) => {
  try {
    const {
      docType,
      partyName,
      taxId,
      amount,
      series,
      type
    } = req.body;

    const cleanTax = taxId || '00.000.000/0001-00';
    const numDigits = Math.floor(10000 + Math.random() * 90000);
    const invNumber = `${docType || 'NF-e'} 000.0${numDigits}`;
    const accessKey = `3524 10${Math.floor(10000000000000 + Math.random() * 90000000000000)} 5500 1000 0${numDigits} 1234 5678 9012`;

    const now = new Date();
    const dateStr = 'Hoje, ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newInv = db.addInvoice({
      number: invNumber,
      series: series || 'Série 1',
      type: type || 'Saída',
      docType: docType || 'NF-e',
      partyName: partyName || 'Consumidor Final',
      taxId: cleanTax,
      date: dateStr,
      amount: Number(amount) || 0,
      status: 'Autorizada',
      accessKey,
      xmlAvailable: true
    });

    res.status(201).json({
      success: true,
      message: `${newInv.docType} Autorizada com Sucesso na SEFAZ`,
      data: newInv
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/invoices/consult-key - Consult key in SEFAZ
router.post('/consult-key', (req: Request, res: Response) => {
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
        status: 'Autorizada',
        sefazStatus: '100 - Autorizado o uso da NF-e',
        uf: 'SP',
        environment: 'Produção',
        protocol: `13524000${Math.floor(10000000 + Math.random() * 90000000)}`,
        authDate: new Date().toISOString()
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/invoices/:id/xml - Generate/Download XML
router.get('/:id/xml', (req: Request, res: Response) => {
  try {
    const invoices = db.getInvoices();
    const inv = invoices.find(i => i.id === req.params.id);
    if (!inv) {
      return res.status(404).json({ success: false, message: 'Nota fiscal não encontrada' });
    }

    const cleanKey = inv.accessKey.replace(/\s/g, '');
    const cleanNum = inv.number.replace(/\D/g, '');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe>
    <infNFe Id="NFe${cleanKey}" versao="4.00">
      <ide>
        <cUF>35</cUF>
        <cNF>08472918</cNF>
        <natOp>Venda de Mercadorias</natOp>
        <mod>${inv.docType === 'NFC-e' ? '65' : '55'}</mod>
        <serie>1</serie>
        <nNF>${cleanNum}</nNF>
        <dhEmi>${new Date().toISOString()}</dhEmi>
        <tpNF>${inv.type === 'Entrada' ? '0' : '1'}</tpNF>
        <idDest>1</idDest>
        <cMunFG>3550308</cMunFG>
        <tpImp>1</tpImp>
        <tpEmis>1</tpEmis>
        <tpAmb>1</tpAmb>
        <finNFe>1</finNFe>
      </ide>
      <emit>
        <CNPJ>12345678000190</CNPJ>
        <xNome>NexStock Logística e Tecnologia LTDA</xNome>
        <xFant>NexStock</xFant>
        <IE>112233445566</IE>
        <CRT>3</CRT>
      </emit>
      <dest>
        <CNPJ>${inv.taxId.replace(/\D/g, '')}</CNPJ>
        <xNome>${inv.partyName}</xNome>
      </dest>
      <total>
        <ICMSTot>
          <vNF>${inv.amount.toFixed(2)}</vNF>
        </ICMSTot>
      </total>
    </infNFe>
  </NFe>
  <protNFe versao="4.00">
    <infProt>
      <tpAmb>1</tpAmb>
      <verAplic>SP_NFE_PL_009_V4</verAplic>
      <chNFe>${cleanKey}</chNFe>
      <dhRecbto>${new Date().toISOString()}</dhRecbto>
      <nProt>135240001234567</nProt>
      <cStat>100</cStat>
      <xMotivo>Autorizado o uso da NF-e</xMotivo>
    </infProt>
  </protNFe>
</nfeProc>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', `attachment; filename="${inv.number.replace(/\s+/g, '_')}.xml"`);
    res.send(xml);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
