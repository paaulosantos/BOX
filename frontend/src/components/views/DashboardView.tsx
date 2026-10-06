import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { ViewType, StockMovement, Product } from '../../types';

interface DashboardViewProps {
  onNavigate: (view: ViewType) => void;
  onOpenImportXmlModal: () => void;
  onOpenNewInvoiceModal: () => void;
  onOpenStockAdjustModal: () => void;
  recentMovements: StockMovement[];
  products: Product[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenImportXmlModal,
  onOpenNewInvoiceModal,
  onOpenStockAdjustModal,
  recentMovements,
  products,
}) => {
  const candleData = [
    { x: new Date(1538778600000), y: [6629.81, 6650.5, 6623.04, 6633.33] },
    { x: new Date(1538780400000), y: [6632.01, 6643.59, 6620, 6630.11] },
    { x: new Date(1538782200000), y: [6630.71, 6648.95, 6623.34, 6635.65] },
    { x: new Date(1538784000000), y: [6635.65, 6651, 6629.67, 6638.24] },
    { x: new Date(1538785800000), y: [6638.24, 6640, 6620, 6624.47] },
    { x: new Date(1538787600000), y: [6624.53, 6636.03, 6621.68, 6624.31] },
    { x: new Date(1538789400000), y: [6624.61, 6632.2, 6617, 6626.02] },
    { x: new Date(1538791200000), y: [6627, 6627.62, 6584.22, 6603.02] },
    { x: new Date(1538793000000), y: [6605, 6608.03, 6598.95, 6604.01] },
    { x: new Date(1538794800000), y: [6604.5, 6614.4, 6602.26, 6608.02] },
    { x: new Date(1538796600000), y: [6608.02, 6610.68, 6601.99, 6608.91] },
    { x: new Date(1538798400000), y: [6608.91, 6618.99, 6608.01, 6612] },
    { x: new Date(1538800200000), y: [6612, 6615.13, 6605.09, 6612] },
    { x: new Date(1538802000000), y: [6612, 6624.12, 6608.43, 6622.95] },
    { x: new Date(1538803800000), y: [6623.91, 6623.91, 6615, 6615.67] },
    { x: new Date(1538805600000), y: [6618.69, 6618.74, 6610, 6610.4] },
    { x: new Date(1538807400000), y: [6611, 6622.78, 6610.4, 6614.9] },
    { x: new Date(1538809200000), y: [6614.9, 6626.2, 6613.33, 6623.45] },
    { x: new Date(1538811000000), y: [6623.48, 6627, 6618.38, 6620.35] },
    { x: new Date(1538812800000), y: [6619.43, 6620.35, 6610.05, 6615.53] },
    { x: new Date(1538814600000), y: [6615.53, 6617.93, 6610, 6615.19] },
    { x: new Date(1538816400000), y: [6615.19, 6621.6, 6608.2, 6620] },
    { x: new Date(1538818200000), y: [6619.54, 6625.17, 6614.15, 6620] },
    { x: new Date(1538820000000), y: [6620.33, 6634.15, 6617.24, 6624.61] },
    { x: new Date(1538821800000), y: [6625.95, 6626, 6611.66, 6617.58] },
    { x: new Date(1538823600000), y: [6619, 6625.97, 6595.27, 6598.86] },
    { x: new Date(1538825400000), y: [6598.86, 6598.88, 6570, 6587.16] },
    { x: new Date(1538827200000), y: [6588.86, 6600, 6580, 6593.4] },
    { x: new Date(1538829000000), y: [6593.99, 6598.89, 6585, 6587.81] },
    { x: new Date(1538830800000), y: [6587.81, 6592.73, 6567.14, 6578] },
    { x: new Date(1538832600000), y: [6578.35, 6581.72, 6567.39, 6579] },
    { x: new Date(1538834400000), y: [6579.38, 6580.92, 6566.77, 6575.96] },
    { x: new Date(1538836200000), y: [6575.96, 6589, 6571.77, 6588.92] },
    { x: new Date(1538838000000), y: [6588.92, 6594, 6577.55, 6589.22] },
    { x: new Date(1538839800000), y: [6589.3, 6598.89, 6589.1, 6596.08] },
    { x: new Date(1538841600000), y: [6597.5, 6600, 6588.39, 6596.25] },
    { x: new Date(1538843400000), y: [6598.03, 6600, 6588.73, 6595.97] },
    { x: new Date(1538845200000), y: [6595.97, 6602.01, 6588.17, 6602] },
    { x: new Date(1538847000000), y: [6602, 6607, 6596.51, 6599.95] },
    { x: new Date(1538848800000), y: [6600.63, 6601.21, 6590.39, 6591.02] },
    { x: new Date(1538850600000), y: [6591.02, 6603.08, 6591, 6591] },
    { x: new Date(1538852400000), y: [6591, 6601.32, 6585, 6592] },
    { x: new Date(1538854200000), y: [6593.13, 6596.01, 6590, 6593.34] },
    { x: new Date(1538856000000), y: [6593.34, 6604.76, 6582.63, 6593.86] },
    { x: new Date(1538857800000), y: [6593.86, 6604.28, 6586.57, 6600.01] },
    { x: new Date(1538859600000), y: [6601.81, 6603.21, 6592.78, 6596.25] },
    { x: new Date(1538861400000), y: [6596.25, 6604.2, 6590, 6602.99] },
    { x: new Date(1538863200000), y: [6602.99, 6606, 6584.99, 6587.81] },
    { x: new Date(1538865000000), y: [6587.81, 6595, 6583.27, 6591.96] },
    { x: new Date(1538866800000), y: [6591.97, 6596.07, 6585, 6588.39] },
    { x: new Date(1538868600000), y: [6587.6, 6598.21, 6587.6, 6594.27] },
    { x: new Date(1538870400000), y: [6596.44, 6601, 6590, 6596.55] },
    { x: new Date(1538872200000), y: [6598.91, 6605, 6596.61, 6600.02] },
    { x: new Date(1538874000000), y: [6600.55, 6605, 6589.14, 6593.01] },
    { x: new Date(1538875800000), y: [6593.15, 6605, 6592, 6603.06] },
    { x: new Date(1538877600000), y: [6603.07, 6604.5, 6599.09, 6603.89] },
    { x: new Date(1538879400000), y: [6604.44, 6604.44, 6600, 6603.5] },
    { x: new Date(1538881200000), y: [6603.5, 6603.99, 6597.5, 6603.86] },
    { x: new Date(1538883000000), y: [6603.85, 6605, 6600, 6604.07] },
    { x: new Date(1538884800000), y: [6604.98, 6606, 6604.07, 6606] },
  ];

  const chartOptions: ApexOptions = {
    chart: {
      type: 'candlestick',
      height: 256,
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      zoom: { enabled: true },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 900,
        animateGradually: { enabled: true, delay: 80 },
        dynamicAnimation: { enabled: true, speed: 400 },
      },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
      candlestick: {
        colors: { upward: '#22c55e', downward: '#ef4444' },
        wick: { useFillColor: true },
      },
    },
    xaxis: { type: 'datetime', labels: { style: { colors: '#94a3b8', fontSize: '11px' } } },
    yaxis: {
      tooltip: { enabled: true },
      labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
    },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
    tooltip: {
      theme: 'dark',
      style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' },
    },
  };

  const chartSeries = [{ data: candleData }];

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
          onClick={() => onNavigate('invoices')}
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
              42 <span className="text-xs font-normal text-slate-400">documentos</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[11px] text-slate-500">38 NF-e • 4 NFC-e</span>
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
              <h2 className="text-sm font-semibold text-slate-900">Mercado — CandleStick</h2>
              <p className="text-xs text-slate-500 mt-0.5">Use zoom e pan para explorar os dados</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Alta</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-slate-600">Baixa</span>
              </div>
            </div>
          </div>

          <div className="w-full">
            <ReactApexChart
              options={chartOptions}
              series={chartSeries}
              type="candlestick"
              height={256}
            />
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
