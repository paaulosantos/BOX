import express, { Request, Response, NextFunction } from 'express';
import productsRouter from './routes/products';
import movementsRouter from './routes/movements';
import transfersRouter from './routes/transfers';
import invoicesRouter from './routes/invoices';
import historyRouter from './routes/history';
import { db, databasePath } from './data/store';
import fs from 'node:fs';
import path from 'node:path';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json({ limit: '12mb' }));

// CORS Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'nexstock-erp-backend',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/products', productsRouter);
app.use('/api/movements', movementsRouter);
app.use('/api/transfers', transfersRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/history', historyRouter);

// Start server
const dataDir = path.resolve(databasePath);
fs.mkdirSync(path.dirname(dataDir), { recursive: true });
db.init().then(() => app.listen(PORT, () => {
  console.log(`⚡ [Backend] Servidor NexStock ERP rodando em http://localhost:${PORT}`);
  console.log(`📡 Endpoints disponíveis:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - REST /api/products`);
  console.log(`   - REST /api/movements`);
  console.log(`   - REST /api/transfers`);
  console.log(`   - REST /api/invoices`);
})).catch(error => { console.error('[Backend] Não foi possível inicializar SQLite:', error); process.exit(1); });

export default app;
