import React from 'react';
import { InventorySnapshot } from '../../types';

interface InventoryHistoryViewProps { snapshots: InventorySnapshot[] }

const money = (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const dateLabel = (value: string) => {
  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('pt-BR');
};

export const InventoryHistoryView: React.FC<InventoryHistoryViewProps> = ({ snapshots }) => {
  const latest = snapshots[snapshots.length - 1];
  return (
    <div className="max-w-6xl mx-auto px-8 py-8 space-y-6 select-none pb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Histórico de Estoque</h1>
        <p className="text-sm text-slate-500 mt-1">Saldos históricos importados da planilha da matriz.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm"><p className="text-xs font-medium text-slate-500">Último valor de custo registrado</p><p className="mt-3 text-2xl font-bold text-slate-900 font-mono">{money(latest?.costValue || 0)}</p></div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm"><p className="text-xs font-medium text-slate-500">Valor de venda potencial</p><p className="mt-3 text-2xl font-bold text-slate-900 font-mono">{money(latest?.saleValue || 0)}</p></div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm"><p className="text-xs font-medium text-slate-500">Itens no último registro</p><p className="mt-3 text-2xl font-bold text-slate-900 font-mono">{(latest?.itemCount || 0).toLocaleString('pt-BR')}</p></div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100"><h2 className="text-base font-semibold text-slate-900">Fechamentos da planilha</h2><p className="text-xs text-slate-500 mt-1">{snapshots.length} registros históricos importados</p></div>
        <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider"><th className="py-3 px-5">Data</th><th className="py-3 px-5 text-right">Valor de custo</th><th className="py-3 px-5 text-right">Valor de venda</th><th className="py-3 px-5 text-right">Quantidade de itens</th></tr></thead><tbody className="divide-y divide-slate-100 text-sm">{snapshots.map(row=><tr key={row.id} className="hover:bg-slate-50/60"><td className="py-3 px-5 text-slate-700">{dateLabel(row.date)}</td><td className="py-3 px-5 text-right font-mono text-slate-700">{money(row.costValue)}</td><td className="py-3 px-5 text-right font-mono text-slate-700">{money(row.saleValue)}</td><td className="py-3 px-5 text-right font-mono text-slate-700">{row.itemCount.toLocaleString('pt-BR')}</td></tr>)}{!snapshots.length&&<tr><td colSpan={4} className="py-10 text-center text-slate-400">Nenhum histórico importado</td></tr>}</tbody></table></div>
      </div>
    </div>
  );
};
