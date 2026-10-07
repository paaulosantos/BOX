import React from 'react';
import { ViewType, StockMovement, Product, Invoice } from '../../types';

interface DashboardViewProps {
  onNavigate: (view: ViewType) => void;
  onOpenImportXmlModal: () => void;
  onOpenNewInvoiceModal: () => void;
  onOpenStockAdjustModal: () => void;
  recentMovements: StockMovement[];
  products: Product[];
  invoices: Invoice[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenImportXmlModal,
  onOpenNewInvoiceModal,
  onOpenStockAdjustModal,
  recentMovements,
  products,
  invoices,
}) => {
  const money = (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Dynamic calculations based on products
  const lowStockCount = products.filter(p => p.status === 'low').length;
  const outOfStockCount = products.filter(p => p.status === 'out').length;
  const totalStockValue = products.reduce((acc, p) => acc + (p.stock * p.costPrice), 0);

  return (
    <div className="max-w-7xl mx-auto px-8 py-8 space-y-8 select-none">
      {/* Header Section: Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Painel Operacional</h1>
          <p className="text-xs text-slate-500 mt-1">Resumo consolidado das movimentações e desempenho financeiro.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenImportXmlModal}
            className="h-9 px-3.5 bg-[#FF8500] hover:bg-[#e67700] text-white rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            <span>Importar XML</span>
          </button>
          <button
            onClick={onOpenNewInvoiceModal}
            className="h-9 px-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-500">receipt_long</span>
            <span>Emitir NF-e</span>
          </button>
          <button
            onClick={onOpenStockAdjustModal}
            className="h-9 px-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-500">tune</span>
            <span>Ajustar Estoque</span>
          </button>
        </div>
      </div>

      {/* Clean 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Valor em Estoque */}
        <div
          onClick={() => onNavigate('inventory')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-[#FFD2A6] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Valor Total em Estoque</span>
            <span className="material-symbols-outlined text-[18px] text-slate-400">inventory_2</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
              {money(totalStockValue)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[11px] text-slate-400">{products.reduce((sum, p) => sum + p.stock, 0).toLocaleString('pt-BR')} unidades cadastradas</span>
            </div>
          </div>
        </div>

        {/* 2. Faturamento Mês */}
        <div
          onClick={() => onNavigate('invoices')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-[#FFD2A6] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Faturamento do Mês</span>
            <span className="material-symbols-outlined text-[18px] text-slate-400">trending_up</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
              {money(invoices.filter(i => i.type === 'Saída').reduce((sum, i) => sum + i.amount, 0))}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[11px] text-slate-500">Total de notas de saída registradas</span>
            </div>
          </div>
        </div>

        {/* 3. Itens em Reposição */}
        <div
          onClick={() => onNavigate('products')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-amber-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Itens em Reposição</span>
            <span className="material-symbols-outlined text-[18px] text-amber-500">warning_amber</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
              {lowStockCount + outOfStockCount} <span className="text-xs font-normal text-slate-400">produtos</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[11px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded">
                {outOfStockCount} sem estoque
              </span>
            </div>
          </div>
        </div>

        {/* 4. NFs Processando */}
        <div
          onClick={() => onNavigate('invoices')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-[#FFD2A6] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">NFs Emitidas Hoje</span>
            <span className="material-symbols-outlined text-[18px] text-slate-400">receipt_long</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
              {invoices.length} <span className="text-xs font-normal text-slate-400">documentos</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[11px] text-slate-500">Notas registradas no sistema</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Chart (60%) & Minimal Transactions Table (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CandleStick Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Movimentações de Estoque</h2>
              <p className="text-xs text-slate-500 mt-0.5">Movimentações registradas no estoque</p>
            </div>
            <span className="text-xs text-slate-500">{recentMovements.length} registros</span>
          </div>

          <div className="w-full">
            <div className="h-64 overflow-y-auto divide-y divide-slate-100">
              {recentMovements.slice(0, 8).map(m => <div key={m.id} className="py-3 flex items-center justify-between text-xs"><div><p className="font-medium text-slate-800">{m.productName}</p><p className="text-slate-400">{m.timestamp}</p></div><span className={m.quantity > 0 ? 'text-emerald-600 font-semibold' : 'text-slate-700 font-semibold'}>{m.quantity > 0 ? '+' : ''}{m.quantity} {m.unit}</span></div>)}
              {!recentMovements.length && <div className="h-full flex items-center justify-center text-sm text-slate-400">Sem movimentações registradas</div>}
            </div>
          </div>
        </div>

        {/* Latest Clean Transactions Table */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Últimas Movimentações</h2>
              <p className="text-xs text-slate-500 mt-0.5">Atividades recentes no estoque</p>
            </div>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-xs text-[#FF8500] font-medium hover:underline cursor-pointer"
            >
              Ver todas
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-medium text-[10px]">
                  <th className="pb-2.5">Horário</th>
                  <th className="pb-2.5">Item</th>
                  <th className="pb-2.5">Tipo</th>
                  <th className="pb-2.5 text-right">Qtd</th>
                  <th className="pb-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentMovements.slice(0, 5).map(m => <tr key={m.id} className="group hover:bg-slate-50/70 transition-colors"><td className="py-3 text-slate-500 font-mono text-[11px]">{m.time}</td><td className="py-3 pr-2"><span className="font-medium text-slate-800 block truncate max-w-[130px]">{m.productName}</span><span className="text-[10px] text-slate-400 font-mono">{m.sku}</span></td><td className="py-3"><span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">{m.operationType}</span></td><td className={`py-3 text-right font-medium ${m.quantity > 0 ? 'text-emerald-600' : 'text-slate-700'}`}>{m.quantity > 0 ? '+' : ''}{m.quantity} {m.unit}</td><td className="py-3 text-right"><span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">Registrado</span></td></tr>)}

                {!recentMovements.length && <tr><td colSpan={5} className="py-10 text-center text-slate-400">Nenhuma movimentação registrada</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
