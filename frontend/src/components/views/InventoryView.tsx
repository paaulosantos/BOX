import React, { useMemo, useState } from 'react';
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

export const InventoryView: React.FC<InventoryViewProps> = ({movements,transfers,onOpenStockAdjustModal,onOpenNewTransferModal,onOpenTransferDetailModal,searchQuery}) => {
  const [localSearch,setLocalSearch]=useState('');
  const [tab,setTab]=useState<'all'|'in'|'out'>('all');
  const search=(searchQuery||localSearch).toLocaleLowerCase();
  const filtered=useMemo(()=>movements.filter(m=>`${m.productName} ${m.sku} ${m.operationType}`.toLocaleLowerCase().includes(search)&&(tab==='all'||(tab==='in'?m.quantity>0:m.quantity<0))),[movements,search,tab]);
  const incoming=movements.filter(m=>m.quantity>0).reduce((sum,m)=>sum+m.quantity,0);
  const outgoing=movements.filter(m=>m.quantity<0).reduce((sum,m)=>sum+Math.abs(m.quantity),0);
  const activeTransfers=transfers.filter(t=>t.status!=='Concluído').length;
  const metrics=[['Movimentações registradas',movements.length],['Unidades recebidas',incoming],['Unidades ajustadas/retiradas',outgoing],['Transferências em aberto',activeTransfers]];
  return <div className="max-w-7xl mx-auto px-8 py-8 space-y-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-slate-900">Estoque e movimentações</h1><p className="text-sm text-slate-500 mt-1">Entradas e ajustes persistidos no banco de dados.</p></div><div className="flex gap-2"><button onClick={onOpenStockAdjustModal} className="px-4 py-2 border rounded-lg text-sm">Ajustar saldo</button><button onClick={onOpenNewTransferModal} className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm">Nova transferência</button></div></div>
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">{metrics.map(([label,value])=><div key={label} className="bg-white p-5 border rounded-xl"><div className="text-xs text-slate-500">{label}</div><div className="text-2xl font-bold mt-2">{value}</div></div>)}</div>
    <div className="bg-white border rounded-xl overflow-hidden"><div className="p-4 border-b flex flex-wrap gap-3 justify-between"><div className="flex gap-2">{(['all','in','out'] as const).map(item=><button key={item} onClick={()=>setTab(item)} className={`px-3 py-1.5 rounded text-xs ${tab===item?'bg-slate-900 text-white':'bg-slate-100'}`}>{item==='all'?'Todas':item==='in'?'Entradas':'Saídas'}</button>)}</div><input value={localSearch} onChange={e=>setLocalSearch(e.target.value)} placeholder="Buscar produto ou código" className="border rounded-lg px-3 py-2 text-sm" /></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-500 text-xs"><tr><th className="text-left p-3">Data</th><th className="text-left p-3">Produto</th><th className="text-left p-3">Operação</th><th className="text-left p-3">Origem / destino</th><th className="text-right p-3">Quantidade</th></tr></thead><tbody className="divide-y">{filtered.length?filtered.map(m=><tr key={m.id}><td className="p-3 text-slate-500">{m.timestamp}</td><td className="p-3"><div className="font-medium">{m.productName}</div><div className="text-xs text-slate-400">{m.sku}</div></td><td className="p-3">{m.operationType}</td><td className="p-3 text-slate-500">{m.origin} → {m.destination}</td><td className={`p-3 text-right font-mono ${m.quantity>0?'text-emerald-700':'text-slate-700'}`}>{m.quantity>0?'+':''}{m.quantity} {m.unit}</td></tr>):<tr><td colSpan={5} className="p-10 text-center text-slate-500">Nenhuma movimentação registrada.</td></tr>}</tbody></table></div></div>
    <div className="bg-white border rounded-xl p-5"><h2 className="font-semibold">Transferências registradas</h2>{transfers.length?<div className="mt-3 divide-y">{transfers.map(t=><button key={t.id} onClick={()=>onOpenTransferDetailModal(t)} className="w-full py-3 flex justify-between text-left"><span><span className="block font-medium">{t.code} · {t.productName}</span><span className="text-xs text-slate-500">{t.originBranch} → {t.destinationBranch} · {t.quantity} un.</span></span><span className="text-xs text-slate-600">{t.status}</span></button>)}</div>:<p className="mt-3 text-sm text-slate-500">Nenhuma transferência registrada.</p>}</div>
  </div>;
};
