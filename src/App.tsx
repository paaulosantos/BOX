import { useState } from 'react';
import { ViewType, Product, StockMovement, Transfer, Invoice, StagedInvoice, ToastMessage } from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_MOVEMENTS,
  INITIAL_TRANSFERS,
  INITIAL_INVOICES,
  STAGED_INVOICE_DEFAULT,
} from './data/initialData';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';

// Views
import { DashboardView } from './components/views/DashboardView';
import { ProductsView } from './components/views/ProductsView';
import { InventoryView } from './components/views/InventoryView';
import { InvoicesView } from './components/views/InvoicesView';
import { GenericModuleView } from './components/views/GenericModuleView';

// Modals
import { StockAdjustmentModal } from './components/modals/StockAdjustmentModal';
import { FiscalDetailsModal } from './components/modals/FiscalDetailsModal';
import { AccessKeyModal } from './components/modals/AccessKeyModal';
import { DanfeViewerModal } from './components/modals/DanfeViewerModal';
import { NewProductModal } from './components/modals/NewProductModal';
import { NewSaleModal } from './components/modals/NewSaleModal';
import { NewTransferModal } from './components/modals/NewTransferModal';
import { TransferDetailModal } from './components/modals/TransferDetailModal';
import { LinkSkuModal } from './components/modals/LinkSkuModal';
import { NewInvoiceModal } from './components/modals/NewInvoiceModal';
import { ImageLinksModal } from './components/modals/ImageLinksModal';

export default function App() {
  // State
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [movements, setMovements] = useState<StockMovement[]>(INITIAL_MOVEMENTS);
  const [transfers, setTransfers] = useState<Transfer[]>(INITIAL_TRANSFERS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [stagedInvoice, setStagedInvoice] = useState<StagedInvoice | null>(STAGED_INVOICE_DEFAULT);

  // Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals
  const [isStockAdjustOpen, setIsStockAdjustOpen] = useState(false);
  const [fiscalProduct, setFiscalProduct] = useState<Product | null>(null);
  const [isAccessKeyOpen, setIsAccessKeyOpen] = useState(false);
  const [danfeInvoice, setDanfeInvoice] = useState<Invoice | null>(null);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [isNewTransferOpen, setIsNewTransferOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [linkSkuItem, setLinkSkuItem] = useState<any | null>(null);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [newInvoiceDocType, setNewInvoiceDocType] = useState<'NF-e' | 'NFC-e'>('NF-e');
  const [isImageLinksOpen, setIsImageLinksOpen] = useState(false);

  // Toast Helper
  const showToast = (title: string, description?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Business Action Handlers
  const handleSaveStockAdjustment = (
    productId: string,
    newStock: number,
    reason: string,
    observation: string
  ) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const diff = newStock - prod.stock;

    // Update product stock
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
            ...p,
            stock: newStock,
            status: newStock > 20 ? 'ok' : newStock > 0 ? 'low' : 'out',
          }
          : p
      )

    );

    // Register movement
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const newMovement: StockMovement = {
      id: Date.now().toString(),
      timestamp: '24/10 ' + timeString,
      time: timeString,
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      origin: 'Prat. C-01',
      destination: 'Inventário',
      operationType: reason === 'avaria' ? 'Ajuste Avaria' : 'Ajuste Inventário',
      quantity: diff,
      unit: prod.unit,
      responsibleName: 'Mariana Silva',
      responsibleAvatar: 'https://lh3.googleusercontent.com/a/ACg8ocL_user4_avatar',
      branch: 'matriz',
    };

    setMovements((prev) => [newMovement, ...prev]);
    showToast(
      'Ajuste Registrado com Sucesso',
      `Saldo de ${prod.name} atualizado para ${newStock} ${prod.unit} (${diff >= 0 ? '+' : ''}${diff})`
    );
  };

  const handleSaveFiscal = (productId: string, ncm: string, icms: string, cfop: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ncm, icms, cfop } : p))
    );
    showToast('Ficha Fiscal Atualizada', `NCM ${ncm} e alíquota ${icms} salvos.`);
    setFiscalProduct(null);
  };

  const handleAddProduct = (newProdData: Omit<Product, 'id'>) => {
    const newId = Date.now().toString();
    const newProd: Product = { id: newId, ...newProdData };
    setProducts((prev) => [newProd, ...prev]);
    showToast('Produto Cadastrado', `${newProd.name} (${newProd.sku}) adicionado ao estoque.`);
  };

  const handleCompleteSale = (saleData: {
    clientName: string;
    taxId: string;
    productId: string;
    quantity: number;
    totalAmount: number;
    emitNfe: boolean;
  }) => {
    const prod = products.find((p) => p.id === saleData.productId);
    if (!prod) return;

    // Deduct stock
    setProducts((prev) =>
      prev.map((p) =>
        p.id === prod.id
          ? {
            ...p,
            stock: Math.max(0, p.stock - saleData.quantity),
            status: p.stock - saleData.quantity > 20 ? 'ok' : p.stock - saleData.quantity > 0 ? 'low' : 'out',
          }
          : p
      )
    );

    // Register movement
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const saleMov: StockMovement = {
      id: Date.now().toString(),
      timestamp: 'Hoje ' + timeString,
      time: timeString,
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      origin: 'Prat. A-12',
      destination: 'PDV Caixa 01',
      operationType: 'Saída PDV',
      quantity: -saleData.quantity,
      unit: prod.unit,
      responsibleName: 'Juliana Lima',
      responsibleAvatar: 'https://lh3.googleusercontent.com/a/ACg8ocL_user2_avatar',
      branch: 'matriz',
    };
    setMovements((prev) => [saleMov, ...prev]);

    // If emit NF-e
    if (saleData.emitNfe) {
      const invNum = Math.floor(Math.random() * 900) + 100;
      const newInv: Invoice = {
        id: Date.now().toString(),
        number: `NF-e 000.010.${invNum}`,
        series: 'Série 1',
        type: 'Saída',
        partyName: saleData.clientName,
        taxId: saleData.taxId,
        date: 'Hoje, ' + timeString,
        amount: saleData.totalAmount,
        status: 'Autorizada',
        accessKey: '3524 ' + Array.from({ length: 10 }, () => Math.floor(Math.random() * 9000) + 1000).join(' '),
        docType: 'NF-e',
        xmlAvailable: true,
      };
      setInvoices((prev) => [newInv, ...prev]);
      showToast(
        'Venda Concluída & NF-e Autorizada',
        `Pedido de R$ ${saleData.totalAmount.toFixed(2)} faturado com sucesso!`
      );
    } else {
      showToast('Venda Registrada', `Pedido faturado no valor de R$ ${saleData.totalAmount.toFixed(2)}`);
    }
  };

  const handleAddTransfer = (transferData: Omit<Transfer, 'id'>) => {
    const newTrf: Transfer = { id: Date.now().toString(), ...transferData };
    setTransfers((prev) => [newTrf, ...prev]);
    showToast('Transferência Iniciada', `${newTrf.code}: ${newTrf.description}`);
  };

  const handleCompleteTransfer = (transferId: string) => {
    setTransfers((prev) =>
      prev.map((t) => (t.id === transferId ? { ...t, status: 'Concluído', progressPercent: 100 } : t))
    );
    showToast('Transferência Concluída', 'Mercadoria recebida e adicionada ao saldo local.');
  };

  const handleConfirmXmlEntry = (staged: StagedInvoice) => {
    // Add new movement for supplier inbound
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const inboundMov: StockMovement = {
      id: Date.now().toString(),
      timestamp: 'Hoje ' + timeStr,
      time: timeStr,
      productId: 'inbound_xml',
      productName: staged.items[0]?.name || 'Lote de Mercadorias XML',
      sku: 'LOTE-XML',
      origin: 'Doca Recebimento',
      destination: 'Almoxarifado Geral',
      operationType: 'Entrada Fornecedor',
      quantity: staged.items.reduce((a, b) => a + b.quantity, 0),
      unit: 'un',
      responsibleName: 'Carlos Santos',
      responsibleAvatar: 'https://lh3.googleusercontent.com/a/ACg8ocL_user1_avatar',
      branch: 'matriz',
    };
    setMovements((prev) => [inboundMov, ...prev]);

    // Add invoice to list if not present
    const newInv: Invoice = {
      id: Date.now().toString(),
      number: staged.invoiceNumber,
      series: 'Série 1',
      type: 'Entrada',
      partyName: staged.supplierName,
      taxId: staged.supplierCnpj,
      date: 'Hoje, ' + timeStr,
      amount: staged.totalAmount,
      status: 'Autorizada',
      accessKey: staged.accessKey,
      docType: 'NF-e',
      xmlAvailable: true,
    };
    setInvoices((prev) => [newInv, ...prev]);
    setStagedInvoice(null);

    showToast(
      'Entrada de Mercadorias Confirmada',
      `Itens da nota ${staged.invoiceNumber} incorporados ao inventário físico.`
    );
  };

  const handleLinkSku = (itemId: string, sku: string) => {
    if (!stagedInvoice) return;
    setStagedInvoice({
      ...stagedInvoice,
      items: stagedInvoice.items.map((it) =>
        it.id === itemId ? { ...it, status: 'linked', skuMatch: sku } : it
      ),
    });
    showToast('SKU Vinculado', `Vínculo com ${sku} salvo para este item.`);
  };

  const handleConsultKey = (key: string) => {
    showToast(
      'NF-e Localizada na SEFAZ',
      `Chave ${key.slice(0, 16)}... encontrada. Documento válido e autorizado.`
    );
  };

  const handleEmitInvoice = (newInv: Omit<Invoice, 'id'>) => {
    const inv: Invoice = { id: Date.now().toString(), ...newInv };
    setInvoices((prev) => [inv, ...prev]);
    showToast(
      `${inv.docType} Emitida com Sucesso`,
      `Protocolo autorizatório gerado. Documento disponível para download.`
    );
  };

  const handleDownloadXml = (inv: Invoice) => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe>
    <infNFe Id="NFe${inv.accessKey.replace(/\s/g, '')}" versao="4.00">
      <ide>
        <nNF>${inv.number.replace(/\D/g, '')}</nNF>
        <serie>1</serie>
        <dEmi>${inv.date}</dEmi>
        <tpNF>${inv.type === 'Entrada' ? '0' : '1'}</tpNF>
      </ide>
      <emit>
        <xNome>NexStock Distribuidora LTDA</xNome>
        <CNPJ>10450880000122</CNPJ>
      </emit>
      <dest>
        <xNome>${inv.partyName}</xNome>
        <CNPJ>${inv.taxId.replace(/\D/g, '')}</CNPJ>
      </dest>
      <total>
        <vNF>${inv.amount.toFixed(2)}</vNF>
      </total>
    </infNFe>
  </NFe>
</nfeProc>`;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.number.replace(/\s+/g, '_')}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Download do XML Concluído', `Arquivo ${inv.number}.xml baixado.`);
  };

  const handleRefreshStatus = (inv: Invoice) => {
    setInvoices((prev) =>
      prev.map((item) => (item.id === inv.id ? { ...item, status: 'Autorizada' } : item))
    );
    showToast('Status Sincronizado', `${inv.number} foi autorizada com sucesso na SEFAZ.`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col">
      {/* Main Top Header */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        currentBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
        onTriggerToast={showToast}
        onOpenImageLinks={() => setIsImageLinksOpen(true)}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex pt-14">
        {/* Persistent Modules Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          stockAlertCount={products.filter((p) => p.status === 'low' || p.status === 'out').length}
          pendingInvoiceCount={invoices.filter((i) => i.status === 'Processando').length}
        />

        {/* Content Area with 60px Sidebar Offset */}
        <main className="flex-1 ml-60 min-h-[calc(100vh-3.5rem)] overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={setCurrentView}
              onOpenNewSaleModal={() => setIsNewSaleOpen(true)}
              onOpenImportXmlModal={() => {
                setCurrentView('invoices');
                showToast('Importador de XML', 'Selecione ou arraste o arquivo XML da sua nota.');
              }}
              onOpenNewInvoiceModal={() => {
                setNewInvoiceDocType('NF-e');
                setIsNewInvoiceOpen(true);
              }}
              onOpenStockAdjustModal={() => setIsStockAdjustOpen(true)}
              recentMovements={movements}
              products={products}
            />
          )}

          {currentView === 'products' && (
            <ProductsView
              products={products}
              onOpenNewProductModal={() => setIsNewProductOpen(true)}
              onOpenFiscalModal={(p) => setFiscalProduct(p)}
              onOpenEditModal={(p) => {
                setFiscalProduct(p);
                showToast('Editar Produto', `Editando informações de ${p.name}`);
              }}
              onOpenImportModal={() => {
                setCurrentView('invoices');
                showToast('Importação de Produtos via XML', 'Carregue a nota fiscal para importar novos SKUs.');
              }}
              searchQuery={globalSearch}
            />
          )}

          {currentView === 'inventory' && (
            <InventoryView
              movements={movements}
              transfers={transfers}
              onOpenStockAdjustModal={() => setIsStockAdjustOpen(true)}
              onOpenNewTransferModal={() => setIsNewTransferOpen(true)}
              onOpenTransferDetailModal={(t) => setSelectedTransfer(t)}
              searchQuery={globalSearch}
              onTriggerToast={showToast}
            />
          )}

          {currentView === 'invoices' && (
            <InvoicesView
              invoices={invoices}
              stagedInvoice={stagedInvoice}
              onConfirmXmlEntry={handleConfirmXmlEntry}
              onOpenNewInvoiceModal={() => {
                setNewInvoiceDocType('NF-e');
                setIsNewInvoiceOpen(true);
              }}
              onOpenNewNfceModal={() => {
                setNewInvoiceDocType('NFC-e');
                setIsNewInvoiceOpen(true);
              }}
              onOpenAccessKeyModal={() => setIsAccessKeyOpen(true)}
              onOpenDanfeModal={(inv) => setDanfeInvoice(inv)}
              onDownloadXml={handleDownloadXml}
              onRefreshInvoiceStatus={handleRefreshStatus}
              onViewCancellationReason={(inv) =>
                showToast(
                  'Cancelamento de NF-e',
                  `Nota cancelada pelo emitente. Motivo: Erro nos dados cadastrais do cliente.`
                )
              }
              onLinkSkuModal={(item) => setLinkSkuItem(item)}
              onTriggerToast={showToast}
              searchQuery={globalSearch}
            />
          )}

          {(currentView === 'sales' || currentView === 'purchases' || currentView === 'finance') && (
            <GenericModuleView
              module={currentView}
              onNavigate={setCurrentView}
              onOpenNewSale={() => setIsNewSaleOpen(true)}
              onOpenNewInvoice={() => {
                setNewInvoiceDocType('NF-e');
                setIsNewInvoiceOpen(true);
              }}
            />
          )}
        </main>
      </div>

      {/* Floating Fast Screen Switcher & Direct Image Helper Button */}
      <div className="fixed bottom-5 left-64 z-30 flex items-center gap-2">
        <button
          onClick={() => setIsImageLinksOpen(true)}
          className="h-9 px-3.5 bg-slate-900/90 hover:bg-slate-900 text-white rounded-full text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer border border-slate-700/50 hover:scale-102"
        >
          <span className="material-symbols-outlined text-[17px] text-sky-400">photo_library</span>
          <span>Ver Telas do HTML &amp; Links</span>
        </button>
      </div>

      {/* Modals Collection */}
      <StockAdjustmentModal
        isOpen={isStockAdjustOpen}
        onClose={() => setIsStockAdjustOpen(false)}
        products={products}
        onSaveAdjustment={handleSaveStockAdjustment}
      />

      <FiscalDetailsModal
        product={fiscalProduct}
        onClose={() => setFiscalProduct(null)}
        onSaveFiscal={handleSaveFiscal}
      />

      <AccessKeyModal
        isOpen={isAccessKeyOpen}
        onClose={() => setIsAccessKeyOpen(false)}
        onConsultKey={handleConsultKey}
      />

      <DanfeViewerModal
        invoice={danfeInvoice}
        onClose={() => setDanfeInvoice(null)}
        onPrint={() => window.print()}
      />

      <NewProductModal
        isOpen={isNewProductOpen}
        onClose={() => setIsNewProductOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <NewSaleModal
        isOpen={isNewSaleOpen}
        onClose={() => setIsNewSaleOpen(false)}
        products={products}
        onCompleteSale={handleCompleteSale}
      />

      <NewTransferModal
        isOpen={isNewTransferOpen}
        onClose={() => setIsNewTransferOpen(false)}
        products={products}
        onAddTransfer={handleAddTransfer}
      />

      <TransferDetailModal
        transfer={selectedTransfer}
        onClose={() => setSelectedTransfer(null)}
        onCompleteTransfer={handleCompleteTransfer}
      />

      <LinkSkuModal
        item={linkSkuItem}
        isOpen={!!linkSkuItem}
        onClose={() => setLinkSkuItem(null)}
        products={products}
        onLink={handleLinkSku}
      />

      <NewInvoiceModal
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
        products={products}
        docTypeDefault={newInvoiceDocType}
        onEmitInvoice={handleEmitInvoice}
      />

      <ImageLinksModal
        isOpen={isImageLinksOpen}
        onClose={() => setIsImageLinksOpen(false)}
        onSelectScreen={setCurrentView}
      />

      {/* Global Toast System */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
