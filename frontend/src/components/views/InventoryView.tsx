import React, { useState, useMemo } from 'react';
import { StockMovement, Transfer } from '../../types';

interface InventoryViewProps {
  movements: StockMovement[];
  transfers: Transfer[];
  onOpenStockAdjustModal: () => void;
  onOpenNewTransferModal: () => void;
  onOpenTransferDetailModal: (transfer: Transfer) => void;
  searchQuery: string;
  onTriggerToast: (title: string, desc?: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  movements,
  transfers,
  onOpenStockAdjustModal,
  onOpenNewTransferModal,
  onOpenTransferDetailModal,
  searchQuery,
  onTriggerToast,
}) => {
  const [selectedBranchTab, setSelectedBranchTab] = useState<'all' | 'matriz' | 'curitiba'>('all');
  const [localSearch, setLocalSearch] = useState('');
  const [filterOp, setFilterOp] = useState<string>('all');
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [page, setPage] = useState(1);

  // Dynamic KPI values based on selected branch
  const kpiData = useMemo(() => {
    if (selectedBranchTab === 'matriz') {
      return {
        disponivel: '7.420',
        transito: '210',
        reservado: '540',
        porcentagem: '92% do total',
        remessas: '2 remessas em rota',
      };
    } else if (selectedBranchTab === 'curitiba') {
      return {
        disponivel: '3.820',
        transito: '220',
        reservado: '310',
        porcentagem: '89% do total',
        remessas: '1 remessa em rota',
      };
    }
    return {
      disponivel: '11.240',
      transito: '430',
      reservado: '850',
      porcentagem: '91% do total',
      remessas: '3 remessas em rota',
    };
  }, [selectedBranchTab]);

  const effectiveSearch = (searchQuery || localSearch).toLowerCase();

  const filteredMovements = useMemo(() => {
    return movements.filter((m) => {
      // Branch filter
      if (selectedBranchTab !== 'all' && m.branch !== selectedBranchTab && m.branch !== 'all') {
        return false;
      }
      // Search filter
      const matchesSearch =
        m.productName.toLowerCase().includes(effectiveSearch) ||
        m.sku.toLowerCase().includes(effectiveSearch) ||
        m.origin.toLowerCase().includes(effectiveSearch) ||
        m.destination.toLowerCase().includes(effectiveSearch);

      if (!matchesSearch) return false;

      // Operation filter
      if (filterOp !== 'all' && m.operationType !== filterOp) {
        return false;
      }

      return true;
    });
  }, [movements, selectedBranchTab, effectiveSearch, filterOp]);

  const handleBranchClick = (branch: 'all' | 'matriz' | 'curitiba', label: string) => {
    setSelectedBranchTab(branch);
    onTriggerToast(`Filtrado por: ${label}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8 space-y-8 select-none pb-16">
      {/* Cabeçalho Principal e Ações Limpas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">Estoque &amp; Movimentações</h1>
          <p className="text-sm text-slate-500 mt-0.5">Visão consolidada de inventário, transferências e fluxo recente</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenStockAdjustModal}
            className="h-9 px-4 bg-white hover:bg-gray-50 border border-slate-200 text-slate-800 rounded-lg flex items-center gap-2 font-medium text-sm transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">tune</span>
            <span>Ajuste de Estoque</span>
          </button>
          <button
            onClick={onOpenNewTransferModal}
            className="h-9 px-4 bg-[#FF8500] hover:bg-[#e67700] text-white rounded-lg flex items-center gap-2 font-medium text-sm transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Nova Transferência</span>
          </button>
        </div>
      </div>

      {/* Abas Limpas de Filiais */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => handleBranchClick('all', 'Todas as Filiais')}
          className={`px-4 py-2 rounded-lg text-sm transition-all cursor-pointer ${
            selectedBranchTab === 'all'
              ? 'bg-[#FF8500] text-white font-semibold shadow-xs'
              : 'font-medium text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          Todas as Filiais
        </button>
        <button
          onClick={() => handleBranchClick('matriz', 'Matriz SP')}
          className={`px-4 py-2 rounded-lg text-sm transition-all cursor-pointer ${
            selectedBranchTab === 'matriz'
              ? 'bg-[#FF8500] text-white font-semibold shadow-xs'
              : 'font-medium text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          Matriz SP
        </button>
        <button
          onClick={() => handleBranchClick('curitiba', 'CD Curitiba')}
          className={`px-4 py-2 rounded-lg text-sm transition-all cursor-pointer ${
            selectedBranchTab === 'curitiba'
              ? 'bg-[#FF8500] text-white font-semibold shadow-xs'
              : 'font-medium text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          CD Curitiba
        </button>
      </div>

      {/* 3 Indicadores Principais e Arejados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Indicador 1: Disponível */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Saldo Disponível</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF1DC] flex items-center justify-center text-[#FF8500]">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight font-mono">{kpiData.disponivel}</span>
            <span className="text-xs font-semibold text-slate-400 uppercase">unidades</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pronto para faturamento</span>
            <span className="font-medium text-slate-800">{kpiData.porcentagem}</span>
          </div>
        </div>

        {/* Indicador 2: Em Trânsito */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Em Trânsito</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">sync_alt</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight font-mono">{kpiData.transito}</span>
            <span className="text-xs font-semibold text-slate-400 uppercase">unidades</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{kpiData.remessas}</span>
            <span className="font-medium text-slate-800 font-mono">CFOP 5152/6152</span>
          </div>
        </div>

        {/* Indicador 3: Reservado */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Reservado</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">lock_clock</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight font-mono">{kpiData.reservado}</span>
            <span className="text-xs font-semibold text-slate-400 uppercase">unidades</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pedidos PDV &amp; E-commerce</span>
            <span className="font-medium text-slate-800">Aguardando envio</span>
          </div>
        </div>
      </div>

      {/* Seção: Transferências Ativas */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Transferências Ativas</h2>
            <p className="text-xs text-slate-500">Remessas interestaduais com rastreamento logístico</p>
          </div>
          <button
            onClick={() => onTriggerToast('Lista de transferências', 'Exibindo 2 remessas ativas no momento')}
            className="text-xs font-medium text-[#FF8500] hover:underline cursor-pointer"
          >
            Ver todas (3)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transfers.map((trf) => (
            <div
              key={trf.id}
              className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#FF8500] px-2 py-0.5 bg-[#FFF1DC] border border-[#FFD2A6]/50 rounded">
                    {trf.code}
                  </span>
                  <span className="text-xs text-slate-500">{trf.description}</span>
                </div>
                {trf.status === 'Em Rota' ? (
                  <span className="text-xs font-medium text-[#FF8500] bg-[#FFF1DC] border border-[#FFD2A6]/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF8500]" /> Em Rota
                  </span>
                ) : (
                  <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Em Separação
                  </span>
                )}
              </div>

              {/* Rota Origem / Destino */}
              <div className="flex items-center justify-between text-sm py-1">
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-400 uppercase font-medium">Origem</span>
                  <span className="font-semibold text-slate-800">{trf.originBranch}</span>
                </div>
                <div className="flex-1 mx-4 flex flex-col items-center">
                  <span className="material-symbols-outlined text-[16px] text-slate-400 mb-1">arrow_forward</span>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        trf.status === 'Em Rota' ? 'bg-[#FF8500]' : 'bg-amber-500'
                      }`}
                      style={{ width: `${trf.progressPercent}%` }}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[11px] text-slate-400 uppercase font-medium">Destino</span>
                  <span className="font-semibold text-slate-800">{trf.destinationBranch}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span>
                  Previsão: <strong className="text-slate-800 font-semibold">{trf.eta}</strong>
                </span>
                <button
                  onClick={() => onOpenTransferDetailModal(trf)}
                  className="text-[#FF8500] hover:text-[#e67700] font-medium flex items-center gap-1 cursor-pointer"
                >
                  Acompanhar <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção: Movimentações Recentes */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Movimentações Recentes</h2>
            <p className="text-xs text-slate-500">Histórico auditado de entradas, saídas e transferências</p>
          </div>
          <div className="flex items-center gap-3 relative">
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-slate-400">
                search
              </span>
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Filtrar por produto ou SKU..."
                className="w-full h-8 pl-8 pr-3 bg-slate-50 text-xs rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#FF8500] focus:border-[#FF8500] focus:bg-white focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
              className="h-8 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">tune</span>
              <span>Filtros</span>
            </button>

            {showFiltersDropdown && (
              <div className="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-30">
                <span className="text-[10px] uppercase font-semibold text-slate-400 px-2 py-1 block">Tipo de Operação</span>
                {['all', 'Entrada Fornecedor', 'Saída PDV', 'Transferência', 'Ajuste Avaria'].map((op) => (
                  <button
                    key={op}
                    onClick={() => {
                      setFilterOp(op);
                      setShowFiltersDropdown(false);
                    }}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors ${
                      filterOp === op ? 'bg-[#FFF1DC] text-[#FF8500] font-semibold' : 'text-slate-700'
                    }`}
                  >
                    {op === 'all' ? 'Todas as Operações' : op}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabela Espaçada */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-[#fafbfd]">
                <th className="py-3 px-5">Data &amp; Hora</th>
                <th className="py-3 px-5">Produto</th>
                <th className="py-3 px-5">Origem ➔ Destino</th>
                <th className="py-3 px-5">Operação</th>
                <th className="py-3 px-5 text-right">Qtd</th>
                <th className="py-3 px-5">Responsável</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredMovements.map((mov) => (
                <tr key={mov.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-5 text-xs text-slate-500 whitespace-nowrap">
                    24/10 <span className="text-slate-800 font-medium">{mov.time}</span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-medium text-slate-900">{mov.productName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{mov.sku}</div>
                  </td>
                  <td className="py-4 px-5 text-xs text-slate-600">
                    {mov.origin} <span className="text-[#FF8500] font-bold">➔</span> {mov.destination}
                  </td>
                  <td className="py-4 px-5">
                    {mov.operationType === 'Entrada Fornecedor' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        Entrada Fornecedor
                      </span>
                    )}
                    {mov.operationType === 'Saída PDV' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700">
                        Saída PDV
                      </span>
                    )}
                    {mov.operationType === 'Transferência' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700">
                        Transferência
                      </span>
                    )}
                    {(mov.operationType === 'Ajuste Avaria' || mov.operationType === 'Ajuste Inventário') && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {mov.operationType}
                      </span>
                    )}
                  </td>
                  <td
                    className={`py-4 px-5 text-right font-semibold whitespace-nowrap font-mono ${
                      mov.quantity > 0
                        ? 'text-emerald-600'
                        : mov.operationType === 'Transferência'
                        ? 'text-sky-700'
                        : 'text-rose-600'
                    }`}
                  >
                    {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity} {mov.unit}
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <img
                        src={mov.responsibleAvatar}
                        alt={mov.responsibleName}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-xs font-medium text-slate-800">{mov.responsibleName}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rodapé Paginação */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Mostrando {filteredMovements.length} de 1.482 movimentações</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 font-medium text-slate-700 transition-colors disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(1)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                page === 1 ? 'bg-[#FF8500] text-white' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              1
            </button>
            <button
              onClick={() => setPage(2)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                page === 2 ? 'bg-[#FF8500] text-white' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              2
            </button>
            <button
              onClick={() => setPage(page + 1)}
              className="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 font-medium text-slate-700 transition-colors"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
