import React, { useState, useMemo, useRef } from 'react';
import { Invoice, StagedInvoice } from '../../types';

interface InvoicesViewProps {
  invoices: Invoice[];
  stagedInvoice: StagedInvoice | null;
  onConfirmXmlEntry: (staged: StagedInvoice) => void;
  onOpenNewInvoiceModal: () => void;
  onOpenNewNfceModal: () => void;
  onOpenAccessKeyModal: () => void;
  onOpenDanfeModal: (invoice: Invoice) => void;
  onDownloadXml: (invoice: Invoice) => void;
  onRefreshInvoiceStatus: (invoice: Invoice) => void;
  onViewCancellationReason: (invoice: Invoice) => void;
  onLinkSkuModal: (item: any) => void;
  onTriggerToast: (title: string, desc?: string) => void;
  searchQuery: string;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  stagedInvoice,
  onConfirmXmlEntry,
  onOpenNewInvoiceModal,
  onOpenNewNfceModal,
  onOpenAccessKeyModal,
  onOpenDanfeModal,
  onDownloadXml,
  onRefreshInvoiceStatus,
  onViewCancellationReason,
  onLinkSkuModal,
  onTriggerToast,
  searchQuery,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'in' | 'out' | 'pending'>('all');
  const [localSearch, setLocalSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveSearch = (searchQuery || localSearch).toLowerCase();

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        inv.number.toLowerCase().includes(effectiveSearch) ||
        inv.partyName.toLowerCase().includes(effectiveSearch) ||
        inv.taxId.toLowerCase().includes(effectiveSearch);

      if (!matchesSearch) return false;

      if (activeTab === 'in') return inv.type === 'Entrada';
      if (activeTab === 'out') return inv.type === 'Saída';
      if (activeTab === 'pending') return inv.status === 'Processando' || inv.status === 'Contingência';
      return true;
    });
  }, [invoices, effectiveSearch, activeTab]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onTriggerToast(
        "XML Processado com Sucesso",
        `Arquivo ${file.name} carregado. Verifique os dados abaixo para conciliação.`
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8 space-y-6 select-none pb-16">
      {/* Header: Simple & Direct */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Notas Fiscais &amp; Importação XML</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie emissões, dê entrada em mercadorias e concilie seus arquivos XML de forma automatizada.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenNewNfceModal}
            className="h-9 px-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">point_of_sale</span>
            <span>Emitir NFC-e</span>
          </button>
          <button
            onClick={onOpenNewInvoiceModal}
            className="h-9 px-4 bg-[#004ac6] text-white hover:bg-blue-700 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span>Emitir Nova NF-e</span>
          </button>
        </div>
      </div>

      {/* 3 Clean Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Emitido no Mês</span>
            <span className="material-symbols-outlined text-[20px] text-blue-600">trending_up</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono">R$ 1.284.920,40</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-medium text-emerald-600">+14.2%</span>
              <span className="text-xs text-slate-400">• 894 notas autorizadas</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Notas Recebidas / XML</span>
            <span className="material-symbols-outlined text-[20px] text-slate-500">inventory_2</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono">428 notas</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-mono font-medium text-slate-600">R$ 648.110,88</span>
              <span className="text-xs text-slate-400">conciliadas</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Pendências &amp; Contingência</span>
            <span className="material-symbols-outlined text-[20px] text-amber-500">pending_actions</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono">2 notas</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs text-amber-600 font-medium">1 rascunho</span>
              <span className="text-xs text-slate-400">• 1 em contingência</span>
            </div>
          </div>
        </div>
      </div>

      {/* XML Inbound Section: Clean Dropzone & Staged Note Preview */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Importação e Conciliação de XML</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Envie o arquivo XML do seu fornecedor para dar entrada rápida no estoque e vincular SKUs.
            </p>
          </div>
          <button
            onClick={onOpenAccessKeyModal}
            className="text-xs font-medium text-[#004ac6] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">vpn_key</span>
            <span>Digitar chave de acesso</span>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Minimalist Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-[#004ac6]/50 hover:bg-slate-50/50 rounded-xl p-6 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xml,.zip"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#004ac6] flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">cloud_upload</span>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-800">Arraste o XML da nota ou clique para selecionar</p>
                <p className="text-[11px] text-slate-400">Suporta arquivos .xml ou pacotes .zip da SEFAZ</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 hidden md:inline">Layout 4.00 compatível</span>
              <button
                type="button"
                className="h-8 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors pointer-events-none"
              >
                Procurar arquivo
              </button>
            </div>
          </div>

          {/* Preview da Última Nota Importada */}
          {stagedInvoice && (
            <div className="border border-slate-200/90 rounded-lg overflow-hidden">
              <div className="bg-slate-50/75 px-4 py-3 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-semibold uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                    Última Importação
                  </span>
                  <span className="text-xs font-semibold text-slate-900">{stagedInvoice.supplierName}</span>
                  <span className="text-xs text-slate-400 font-mono">• {stagedInvoice.invoiceNumber}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-600">
                    Total: <span className="font-bold text-slate-900 font-mono text-sm">
                      R$ {stagedInvoice.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <button
                    onClick={() => onConfirmXmlEntry(stagedInvoice)}
                    className="h-7 px-2.5 bg-[#004ac6] text-white rounded text-xs font-medium hover:bg-blue-700 flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">check</span>
                    <span>Confirmar Entrada</span>
                  </button>
                </div>
              </div>

              {/* Minimalist Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-200/60">
                    <tr>
                      <th className="py-2.5 px-4">Nome do Produto</th>
                      <th className="py-2.5 px-4 text-center">Qtd</th>
                      <th className="py-2.5 px-4 text-right">Valor Unitário</th>
                      <th className="py-2.5 px-4 text-center">Status de Vínculo</th>
                      <th className="py-2.5 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {stagedInvoice.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-4 font-medium text-slate-900">{item.name}</td>
                        <td className="py-2.5 px-4 text-center font-mono">{item.quantity} {item.unit}</td>
                        <td className="py-2.5 px-4 text-right font-mono">
                          R$ {item.unitPrice.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {item.status === 'linked' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              <span className="material-symbols-outlined text-[13px]">check_circle</span>
                              Vinculado ({item.skuMatch})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                              <span className="material-symbols-outlined text-[13px]">help_outline</span>
                              Não vinculado
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {item.status === 'linked' ? (
                            <button
                              onClick={() => onLinkSkuModal(item)}
                              className="text-slate-400 hover:text-slate-600 text-xs font-medium cursor-pointer"
                            >
                              Editar
                            </button>
                          ) : (
                            <button
                              onClick={() => onLinkSkuModal(item)}
                              className="text-[#004ac6] hover:text-blue-700 font-medium text-xs cursor-pointer"
                            >
                              Vincular agora
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoices List Section: Clean Table of Invoices */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table Header & Simple Filter Navigation */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeTab === 'all' ? 'font-semibold bg-slate-100 text-slate-800' : 'font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              Todas <span className="text-slate-400 font-normal ml-1">1.420</span>
            </button>
            <button
              onClick={() => setActiveTab('in')}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeTab === 'in' ? 'font-semibold bg-slate-100 text-slate-800' : 'font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              Entradas <span className="text-slate-400 font-normal ml-1">428</span>
            </button>
            <button
              onClick={() => setActiveTab('out')}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeTab === 'out' ? 'font-semibold bg-slate-100 text-slate-800' : 'font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              Saídas <span className="text-slate-400 font-normal ml-1">992</span>
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeTab === 'pending' ? 'font-semibold bg-slate-100 text-slate-800' : 'font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              Pendentes <span className="text-amber-600 font-semibold ml-1">2</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-slate-400">
                search
              </span>
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Filtrar notas..."
                className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:bg-white focus:border-[#004ac6]"
              />
            </div>
          </div>
        </div>

        {/* Simplified Table with Fundamental Columns Only */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-5">Número / Série</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Emissor / Destinatário</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4 text-right">Valor</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInvoices.map((inv) => {
                const isCancelled = inv.status === 'Cancelada';
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className={`py-3.5 px-5 font-mono font-medium ${isCancelled ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      {inv.number}
                      <span className="block text-[11px] text-slate-400 font-sans no-underline">{inv.series}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {inv.type === 'Saída' ? (
                        <span className={`inline-flex text-[11px] font-medium px-2 py-0.5 rounded ${isCancelled ? 'text-slate-500 bg-slate-100' : 'text-blue-700 bg-blue-50'}`}>
                          Saída
                        </span>
                      ) : (
                        <span className="inline-flex text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          Entrada
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`font-medium ${isCancelled ? 'text-slate-500' : 'text-slate-800'}`}>{inv.partyName}</span>
                      <span className="block text-[11px] text-slate-400 font-mono">{inv.taxId}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">{inv.date}</td>

                    <td className={`py-3.5 px-4 text-right font-mono font-semibold ${isCancelled ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      R$ {inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {inv.status === 'Autorizada' && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          Autorizada
                        </span>
                      )}
                      {inv.status === 'Processando' && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Processando
                        </span>
                      )}
                      {inv.status === 'Cancelada' && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          Cancelada
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {inv.status === 'Autorizada' && (
                          <>
                            <button
                              onClick={() => onOpenDanfeModal(inv)}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                              title={inv.docType === 'NFC-e' ? 'Visualizar Cupom' : 'Visualizar DANFE'}
                            >
                              <span className="material-symbols-outlined text-[17px]">
                                {inv.docType === 'NFC-e' ? 'receipt' : 'description'}
                              </span>
                            </button>
                            <button
                              onClick={() => onDownloadXml(inv)}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                              title="Baixar XML"
                            >
                              <span className="material-symbols-outlined text-[17px]">download</span>
                            </button>
                          </>
                        )}

                        {inv.status === 'Processando' && (
                          <button
                            onClick={() => onRefreshInvoiceStatus(inv)}
                            className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                            title="Atualizar Status na SEFAZ"
                          >
                            <span className="material-symbols-outlined text-[17px]">sync</span>
                          </button>
                        )}

                        {inv.status === 'Cancelada' && (
                          <button
                            onClick={() => onViewCancellationReason(inv)}
                            className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            title="Ver Motivo de Cancelamento"
                          >
                            <span className="material-symbols-outlined text-[17px]">info</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Clean Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Exibindo 1 a {filteredInvoices.length} de 1.420 documentos</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-400 cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                currentPage === 1 ? 'bg-[#004ac6] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                currentPage === 2 ? 'bg-[#004ac6] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                currentPage === 3 ? 'bg-[#004ac6] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              3
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
