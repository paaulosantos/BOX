import React, { useState } from 'react';
import { ViewType, StockMovement, Product } from '../../types';

interface DashboardViewProps {
  onNavigate: (view: ViewType) => void;
  onOpenNewSaleModal: () => void;
  onOpenImportXmlModal: () => void;
  onOpenNewInvoiceModal: () => void;
  onOpenStockAdjustModal: () => void;
  recentMovements: StockMovement[];
  products: Product[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNewSaleModal,
  onOpenImportXmlModal,
  onOpenNewInvoiceModal,
  onOpenStockAdjustModal,
  recentMovements,
  products,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ month: string; vendas: string; compras: string } | null>(null);

  // Semiannual datapoints for chart
  const monthsData = [
    { month: 'Nov', vendasVal: 280000, comprasVal: 210000, x: 30, yV: 120, yC: 140 },
    { month: 'Dez', vendasVal: 340000, comprasVal: 250000, x: 140, yV: 95, yC: 125 },
    { month: 'Jan', vendasVal: 310000, comprasVal: 230000, x: 250, yV: 110, yC: 135 },
    { month: 'Fev', vendasVal: 420000, comprasVal: 290000, x: 360, yV: 65, yC: 105 },
    { month: 'Mar', vendasVal: 450000, comprasVal: 320000, x: 470, yV: 55, yC: 95 },
    { month: 'Abril', vendasVal: 486320, comprasVal: 330000, x: 570, yV: 35, yC: 90 },
  ];

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

        {/* 4 Minimal Clean Action Buttons matching Screenshot */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenNewSaleModal}
            className="h-9 px-3.5 bg-[#FF8500] hover:bg-[#e67700] text-white rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Nova Venda</span>
          </button>
          <button
            onClick={onOpenImportXmlModal}
            className="h-9 px-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-500">upload_file</span>
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
              R$ 1.842.950
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                <span className="material-symbols-outlined text-[12px] mr-0.5">arrow_upward</span>+4.2%
              </span>
              <span className="text-[11px] text-slate-400">vs. mês passado</span>
            </div>
          </div>
        </div>

        {/* 2. Faturamento Mês */}
        <div 
          onClick={() => onNavigate('finance')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-[#FFD2A6] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Faturamento do Mês</span>
            <span className="material-symbols-outlined text-[18px] text-slate-400">trending_up</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
              R$ 486.320
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[11px] text-slate-500">93.5% da meta atingida</span>
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
              {lowStockCount + outOfStockCount > 0 ? (lowStockCount + outOfStockCount + 16) : 18} <span className="text-xs font-normal text-slate-400">produtos</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[11px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded">
                6 com estoque crítico
              </span>
            </div>
          </div>
        </div>

        {/* 4. Vendas Hoje */}
        <div 
          onClick={() => onNavigate('sales')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-[#FFD2A6] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Vendas de Hoje</span>
            <span className="material-symbols-outlined text-[18px] text-slate-400">shopping_bag</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
              R$ 24.890
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[11px] text-slate-500">42 pedidos registrados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Chart (60%) & Minimal Transactions Table (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Performance Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Desempenho Semestral</h2>
              <p className="text-xs text-slate-500 mt-0.5">Vendas faturadas em relação às compras de reposição</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF8500]" />
                <span className="text-slate-600">Vendas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD2A6]" />
                <span className="text-slate-600">Compras</span>
              </div>
            </div>
          </div>

          {/* Interactive Vector Chart */}
          <div className="w-full h-64 relative">
            {hoveredPoint && (
              <div 
                className="absolute top-2 right-4 bg-[#3D405B] text-white text-[11px] px-3 py-1.5 rounded-lg shadow-lg pointer-events-none z-10 border border-[#FFD2A6]/30"
              >
                <span className="font-semibold text-[#FFD2A6]">{hoveredPoint.month}: </span>
                <span>Vendas {hoveredPoint.vendas}</span> • <span className="text-[#FFF1DC]">Compras {hoveredPoint.compras}</span>
              </div>
            )}
            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#FF8500" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#FF8500" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="40" x2="580" y2="40" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="90" x2="580" y2="90" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="140" x2="580" y2="140" stroke="#f1f5f9" strokeWidth="1" />

              {/* Area Fill */}
              <polygon
                points="30,120 140,95 250,110 360,65 470,55 570,35 570,170 30,170"
                fill="url(#chartGradient)"
              />

              {/* Compras Line (Warm Peach / Accent) */}
              <polyline
                points="30,140 140,125 250,135 360,105 470,95 570,90"
                fill="none"
                stroke="#FFD2A6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Vendas Line (Primary Orange #FF8500) */}
              <polyline
                points="30,120 140,95 250,110 360,65 470,55 570,35"
                fill="none"
                stroke="#FF8500"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Points */}
              {monthsData.map((pt) => (
                <g key={pt.month} className="cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.yV}
                    r={pt.month === 'Abril' ? 4.5 : 3.5}
                    fill="#FF8500"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all hover:scale-150"
                    onMouseEnter={() => setHoveredPoint({
                      month: pt.month,
                      vendas: `R$ ${(pt.vendasVal / 1000).toFixed(0)}k`,
                      compras: `R$ ${(pt.comprasVal / 1000).toFixed(0)}k`,
                    })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <text
                    x={pt.x}
                    y="190"
                    textAnchor="middle"
                    fill={pt.month === 'Abril' ? '#FF8500' : '#94a3b8'}
                    fontSize="11"
                    fontFamily="Inter"
                    fontWeight={pt.month === 'Abril' ? '600' : '400'}
                  >
                    {pt.month}
                  </text>
                </g>
              ))}
            </svg>
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
                <tr className="group hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 text-slate-500 font-mono text-[11px]">11:38</td>
                  <td className="py-3 pr-2">
                    <span className="font-medium text-slate-800 block truncate max-w-[130px]">Bobina Galvanizada</span>
                    <span className="text-[10px] text-slate-400 font-mono">NX-9011</span>
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">Entrada</span>
                  </td>
                  <td className="py-3 text-right font-medium text-emerald-600">+2.400 kg</td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">Concluído</span>
                  </td>
                </tr>

                <tr className="group hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 text-slate-500 font-mono text-[11px]">11:22</td>
                  <td className="py-3 pr-2">
                    <span className="font-medium text-slate-800 block truncate max-w-[130px]">Válvula Esfera 2"</span>
                    <span className="text-[10px] text-slate-400 font-mono">NX-1204</span>
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#FFF1DC] text-[#FF8500]">Venda</span>
                  </td>
                  <td className="py-3 text-right font-medium text-slate-700">-12 un</td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">Faturado</span>
                  </td>
                </tr>

                <tr className="group hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 text-slate-500 font-mono text-[11px]">10:47</td>
                  <td className="py-3 pr-2">
                    <span className="font-medium text-slate-800 block truncate max-w-[130px]">Rolamento 6205</span>
                    <span className="text-[10px] text-slate-400 font-mono">NX-5519</span>
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">Transf.</span>
                  </td>
                  <td className="py-3 text-right font-medium text-slate-700">150 un</td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">Em trânsito</span>
                  </td>
                </tr>

                <tr className="group hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 text-slate-500 font-mono text-[11px]">10:15</td>
                  <td className="py-3 pr-2">
                    <span className="font-medium text-slate-800 block truncate max-w-[130px]">Parafuso Sextavado</span>
                    <span className="text-[10px] text-slate-400 font-mono">NX-8840</span>
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#FFF1DC] text-[#FF8500]">PDV</span>
                  </td>
                  <td className="py-3 text-right font-medium text-slate-700">-2 cx</td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">Concluído</span>
                  </td>
                </tr>

                <tr className="group hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 text-slate-500 font-mono text-[11px]">08:50</td>
                  <td className="py-3 pr-2">
                    <span className="font-medium text-slate-800 block truncate max-w-[130px]">Cabo Flexível 2.5mm</span>
                    <span className="text-[10px] text-slate-400 font-mono">NX-3310</span>
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">Entrada</span>
                  </td>
                  <td className="py-3 text-right font-medium text-emerald-600">+50 rolos</td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">Concluído</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
