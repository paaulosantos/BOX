import { useState, useEffect } from 'react';
import { ViewType, Product, StockMovement, Transfer, Invoice, StagedInvoice, ToastMessage } from './types';
import { api } from './services/api';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';

// Views
import { DashboardView } from './components/views/DashboardView';
import { ProductsView } from './components/views/ProductsView';
import { InventoryView } from './components/views/InventoryView';
import { InvoicesView } from './components/views/InvoicesView';

// Modals
import { StockAdjustmentModal } from './components/modals/StockAdjustmentModal';
import { FiscalDetailsModal } from './components/modals/FiscalDetailsModal';
import { AccessKeyModal } from './components/modals/AccessKeyModal';
import { DanfeViewerModal } from './components/modals/DanfeViewerModal';
import { NewProductModal } from './components/modals/NewProductModal';
import { NewTransferModal } from './components/modals/NewTransferModal';
import { TransferDetailModal } from './components/modals/TransferDetailModal';
import { LinkSkuModal } from './components/modals/LinkSkuModal';
import { NewInvoiceModal } from './components/modals/NewInvoiceModal';
import { EditProductModal } from './components/modals/EditProductModal';

export default function App() {
  // Navigation & Filter State
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Data State (initialized with fallback data, populated from Backend API)
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stagedInvoice, setStagedInvoice] = useState<StagedInvoice | null>(null);

  // Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals
  const [isStockAdjustOpen, setIsStockAdjustOpen] = useState(false);
  const [fiscalProduct, setFiscalProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAccessKeyOpen, setIsAccessKeyOpen] = useState(false);
  const [danfeInvoice, setDanfeInvoice] = useState<Invoice | null>(null);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isNewTransferOpen, setIsNewTransferOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [linkSkuItem, setLinkSkuItem] = useState<any | null>(null);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [newInvoiceDocType, setNewInvoiceDocType] = useState<'NF-e' | 'NFC-e'>('NF-e');

  // Load initial data from Backend API
  useEffect(() => {
    async function loadData() {
      try {
        const [prods, movs, trfs, invs, staged] = await Promise.all([
          api.getProducts().catch(() => null),
          api.getMovements().catch(() => null),
          api.getTransfers().catch(() => null),
          api.getInvoices().catch(() => null),
          api.getStagedInvoice().catch(() => null),
        ]);

        if (prods) setProducts(prods);
        if (movs) setMovements(movs);
        if (trfs) setTransfers(trfs);
        if (invs) setInvoices(invs);
        setStagedInvoice(staged);
      } catch (e) {
        console.warn('Backend API não conectado, rodando no modo local:', e);
      }
    }
    loadData();
  }, []);

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
  const handleSaveStockAdjustment = async (productId: string, newStock: number, reason: string, observation: string) => {
    try {
      const result = await api.adjustStock(productId, newStock, reason, observation);
      setProducts(prev => prev.map(p => p.id === productId ? result.product : p));
      setMovements(prev => [result.movement, ...prev]);
      showToast('Estoque atualizado', 'O ajuste e a movimentação foram salvos no banco.');
    } catch (error) { showToast('Falha ao salvar ajuste', error instanceof Error ? error.message : 'Tente novamente.'); }
  };
  const handleSaveFiscal = async (productId: string, ncm: string, icms: string, cfop: string) => {
    try {
      const updated = await api.updateFiscal(productId, ncm, icms, cfop);
      setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
      showToast('Ficha fiscal atualizada', `NCM ${ncm} e alíquota ${icms} salvos.`);
      setFiscalProduct(null);
    } catch (error) { showToast('Falha ao salvar dados fiscais', error instanceof Error ? error.message : 'Tente novamente.'); }
  };

  const handleUpdateProduct = async (id:string,data:Partial<Product>) => {
    try { const updated=await api.updateProduct(id,data); setProducts(prev=>prev.map(p=>p.id===id?updated:p)); setEditingProduct(null); showToast('Produto atualizado', 'As alterações foram salvas no banco.'); }
    catch(error) { showToast('Falha ao atualizar produto', error instanceof Error ? error.message : 'Tente novamente.'); }
  };

  const handleAddProduct = async (data: Omit<Product, 'id'>) => {
    try {
      const created = await api.createProduct(data);
      setProducts(prev => [created, ...prev]);
      showToast('Produto cadastrado', `${created.name} foi salvo no banco de dados.`);
    } catch (error) { showToast('Falha ao cadastrar', error instanceof Error ? error.message : 'Tente novamente.'); }
  };
  const handleAddTransfer = async (data: Omit<Transfer, 'id'>) => {
    try { const created = await api.createTransfer(data); setTransfers(prev => [created, ...prev]); showToast('Transferência registrada', created.code); }
    catch (error) { showToast('Falha ao registrar transferência', error instanceof Error ? error.message : 'Tente novamente.'); }
  };
  const handleCompleteTransfer = async (transferId: string) => {
    try { const updated = await api.completeTransfer(transferId); setTransfers(prev => prev.map(t => t.id === transferId ? updated : t)); showToast('Transferência atualizada', 'Status salvo no banco.'); }
    catch (error) { showToast('Falha ao concluir transferência', error instanceof Error ? error.message : 'Tente novamente.'); }
  };
  const handleConfirmXmlEntry = async (staged: StagedInvoice) => {
    try {
      const result = await api.confirmXmlEntry(staged);
      const [prods, movs, invs] = await Promise.all([api.getProducts(), api.getMovements(), api.getInvoices()]);
      setProducts(prods); setMovements(movs); setInvoices(invs); setStagedInvoice(null);
      showToast('Entrada confirmada', `${staged.invoiceNumber} salva; estoque e histórico foram atualizados.`);
    } catch (error) { showToast('Não foi possível confirmar a nota', error instanceof Error ? error.message : 'Confira os vínculos dos itens.'); }
  };
  const handleStageXml = async (staged: StagedInvoice) => {
    const persisted = await api.stageInvoice(staged);
    setStagedInvoice(persisted);
  };

  const handleLinkSku = async (itemId: string, sku: string) => {
    try { const updated = await api.linkStagedSku(itemId, sku); setStagedInvoice(updated); showToast('SKU vinculado', `${sku} salvo na nota pendente.`); }
    catch (error) { showToast('Falha ao vincular SKU', error instanceof Error ? error.message : 'Tente novamente.'); }
  };
  const handleConsultKey = async (key: string) => {
    try { const result = await api.consultKey(key); showToast('Consulta SEFAZ não configurada', result.message || 'Chave validada, mas o sistema ainda não consulta a SEFAZ.'); }
    catch (error) { showToast('Não foi possível validar a chave', error instanceof Error ? error.message : 'Tente novamente.'); }
  };
  const handleEmitInvoice = async (data: Omit<Invoice, 'id'>) => {
    try { const created = await api.emitInvoice(data); setInvoices(prev => [created, ...prev]); showToast('Rascunho salvo', 'O documento foi registrado localmente; ele não foi transmitido à SEFAZ.'); }
    catch (error) { showToast('Falha ao salvar rascunho', error instanceof Error ? error.message : 'Tente novamente.'); }
  };
  const handleDownloadXml = async (inv: Invoice) => {
    try {
      const response = await fetch(api.getXmlUrl(inv.id));
      if (!response.ok) throw new Error('O XML original não está armazenado para esta nota.');
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a'); link.href = url; link.download = `${inv.number.replace(/\s+/g, '_')}.xml`; link.click(); URL.revokeObjectURL(url);
    } catch (error) { showToast('XML indisponível', error instanceof Error ? error.message : 'Tente novamente.'); }
  };

  const handleRefreshStatus = async (_invoice: Invoice) => {
    try { setInvoices(await api.getInvoices()); showToast('Lista atualizada', 'A situação disponível é a registrada neste sistema.'); }
    catch (error) { showToast('Falha ao atualizar notas', error instanceof Error ? error.message : 'Tente novamente.'); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col">
      {/* Main Top Header */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
        onTriggerToast={showToast}
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
                setEditingProduct(p);
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
              onStageXml={handleStageXml}
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
              onViewCancellationReason={(invoice) =>
                showToast(
                  'Cancelamento de NF-e',
                  invoice.cancellationReason || 'Nenhum motivo de cancelamento foi registrado.'
                )
              }
              onLinkSkuModal={(item) => setLinkSkuItem(item)}
              onTriggerToast={showToast}
              searchQuery={globalSearch}
            />
          )}
        </main>
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

      <EditProductModal product={editingProduct} onClose={()=>setEditingProduct(null)} onSave={handleUpdateProduct} />

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

      {/* Global Toast System */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
