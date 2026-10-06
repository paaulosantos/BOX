import express, { Request, Response, NextFunction } from 'express';
import productsRouter from './routes/products';
import movementsRouter from './routes/movements';
import transfersRouter from './routes/transfers';
import invoicesRouter from './routes/invoices';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json());

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

// Start server
app.listen(PORT, () => {
  console.log(`⚡ [Backend] Servidor NexStock ERP rodando em http://localhost:${PORT}`);
  console.log(`📡 Endpoints disponíveis:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - REST /api/products`);
  console.log(`   - REST /api/movements`);
  console.log(`   - REST /api/transfers`);
  console.log(`   - REST /api/invoices`);
});

export default app;
