export type ViewType = 
  | 'dashboard' 
  | 'products' 
  | 'inventory' 
  | 'invoices'
  | 'history';

export interface Product {
  id: string;
  name: string;
  sku: string;
  sourceCode?: string;
  category: string;
  stock: number;
  unit: string;
  purchaseUnit?: string;
  unitsPerPackage?: number;
  minStock: number;
  costPrice: number;
  salePrice: number;
  allowFractional?: boolean;
  fractionStep?: number;
  image?: string;
  supplier?: string;
  invoiceNumber?: string;
  maxStock?: number;
  status: 'ok' | 'low' | 'out' | 'high';
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
  timestamp: string;
  time: string;
  productName: string;
  sku: string;
  origin: string;
  destination: string;
  operationType: 'Entrada Fornecedor' | 'Saída' | 'Saída PDV' | 'Transferência' | 'Ajuste Avaria' | 'Ajuste Inventário';
  quantity: number;
  unit: string;
  responsibleName: string;
  responsibleAvatar: string;
  branch: 'matriz' | 'curitiba' | 'all';
  invoiceNumber?: string;
  unitCost?: number;
  unitSalePrice?: number;
  sourceBalance?: number;
  sourceCostValue?: number;
  sourceSaleValue?: number;
  sourceRow?: number;
}

export interface Transfer {
  id: string;
  code: string;
  description: string;
  productName: string;
  quantity: number;
  originBranch: string;
  destinationBranch: string;
  status: 'Em Rota' | 'Em Separação' | 'Concluído';
  progressPercent: number;
  eta: string;
  trackingCode: string;
  driver?: string;
  plate?: string;
}

export interface Invoice {
  id: string;
  number: string;
  series: string;
  type: 'Saída' | 'Entrada';
  docType: 'NF-e' | 'NFC-e';
  partyName: string;
  taxId: string;
  date: string;
  amount: number;
  status: 'Autorizada' | 'Importada' | 'Processando' | 'Cancelada' | 'Contingência';
  accessKey: string;
  xmlAvailable: boolean;
  cancellationReason?: string;
  xmlContent?: string;
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
  category?: string;
  salePrice?: number;
  imageDataUrl?: string;
  allowFractional?: boolean;
  fractionStep?: number;
  minStock?: number;
  maxStock?: number;
  saleUnit?: string;
  unitsPerPackage?: number;
}

export interface StagedInvoice {
  supplierName: string;
  supplierCnpj: string;
  invoiceNumber: string;
  totalAmount: number;
  issueDate: string;
  accessKey: string;
  items: StagedXmlItem[];
  xmlContent?: string;
}
