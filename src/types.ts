export type ViewType = 
  | 'dashboard' 
  | 'products' 
  | 'inventory' 
  | 'invoices' 
  | 'sales' 
  | 'purchases' 
  | 'finance';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  unit: string;
  minStock: number;
  costPrice: number;
  salePrice: number;
  status: 'ok' | 'low' | 'out';
  icon: string;
  iconBg: string;
  iconColor: string;
  ncm: string;
  icms: string;
  cfop: string;
}

export interface StockMovement {
  id: string;
  productId?: string;
  timestamp: string; // e.g. "24/10 14:32"
  time: string; // e.g. "14:32"
  productName: string;
  sku: string;
  origin: string;
  destination: string;
  operationType: 'Entrada Fornecedor' | 'Saída PDV' | 'Transferência' | 'Ajuste Avaria' | 'Ajuste Inventário';
  quantity: number; // positive or negative
  unit: string;
  responsibleName: string;
  responsibleAvatar: string;
  branch: 'matriz' | 'curitiba' | 'all';
}

export interface Transfer {
  id: string;
  code: string; // e.g. "TRF-2024-089"
  description: string; // e.g. "120x Fonte Bivolt 60W"
  productName: string;
  quantity: number;
  originBranch: string;
  destinationBranch: string;
  status: 'Em Rota' | 'Em Separação' | 'Concluído';
  progressPercent: number;
  eta: string; // e.g. "Hoje às 17:00"
  trackingCode: string;
  driver?: string;
  plate?: string;
}

export interface Invoice {
  id: string;
  number: string; // e.g. "NF-e 000.010.450"
  series: string; // e.g. "Série 1"
  type: 'Saída' | 'Entrada';
  docType: 'NF-e' | 'NFC-e';
  partyName: string; // e.g. "Alpha Computadores e Redes SA"
  taxId: string; // CNPJ or CPF formatted
  date: string; // e.g. "Hoje, 11:28"
  amount: number;
  status: 'Autorizada' | 'Processando' | 'Cancelada' | 'Contingência';
  accessKey: string;
  xmlAvailable: boolean;
  cancellationReason?: string;
}

export interface StagedXmlItem {
  id: string;
  name: string;
  skuMatch?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  status: 'linked' | 'unlinked';
  cfop: string;
  ncm: string;
}

export interface StagedInvoice {
  supplierName: string;
  supplierCnpj: string;
  invoiceNumber: string;
  totalAmount: number;
  issueDate: string;
  accessKey: string;
  items: StagedXmlItem[];
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}
