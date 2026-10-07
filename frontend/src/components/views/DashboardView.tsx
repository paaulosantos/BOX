import React from 'react';
import { ViewType, StockMovement, Product } from '../../types';

interface DashboardViewProps {
  onNavigate: (view: ViewType) => void;
  onOpenImportXmlModal: () => void;
  onOpenNewInvoiceModal: () => void;
  onOpenStockAdjustModal: () => void;
  recentMovements: StockMovement[];
  products: Product[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenImportXmlModal, onOpenNewInvoiceModal, onOpenStockAdjustModal, recentMovements, products }) => {
  const stockUnits = products.reduce((sum, product) => sum + product.stock, 0);
  const costValue = products.reduce((sum, product) => sum + product.stock * product.costPrice, 0);
  const saleValue = products.reduce((sum, product) => sum + product.stock * product.salePrice, 0);
  const lowCount = products.filter(product => product.status === 'low' || product.status === 'out').length;
  const highCount = products.filter(product => product.status === 'high').length;
  const cards = [
    ['Produtos cadastrados', products.length.toLocaleString('pt-BR'), 'inventory_2'],
    ['Unidades em estoque', stockUnits.toLocaleString('pt-BR'), 'warehouse'],
    ['Valor de custo', `R$ ${costValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'payments'],
    ['Valor potencial de venda', `R$ ${saleValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'trending_up'],
  ];
  return <div className="max-w-7xl mx-auto px-8 py-8 space-y-7">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-slate-900">Visão geral</h1><p className="text-sm text-slate-500 mt-1">Indicadores calculados a partir dos registros do banco de dados.</p></div><div className="flex flex-wrap gap-2"><button onClick={onOpenImportXmlModal} className="h-10 px-4 bg-white border rounded-lg text-sm">Importar nota XML</button><button onClick={()=>onNavigate('products')} className="h-10 px-4 bg-[#FF8500] text-white rounded-lg text-sm font-semibold">Cadastrar produto</button></div></div>
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">{cards.map(([label,value,icon])=><div key={label} className="bg-white rounded-xl border border-slate-200 p-5"><div className="flex justify-between text-xs text-slate-500"><span>{label}</span><span className="material-symbols-outlined">{icon}</span></div><div className="mt-3 text-2xl font-bold text-slate-900">{value}</div></div>)}</section>
    <section className="grid lg:grid-cols-3 gap-4"><div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5"><div className="flex justify-between items-center"><div><h2 className="font-semibold text-slate-900">Movimentações recentes</h2><p className="text-xs text-slate-500 mt-1">Entradas e ajustes registrados no sistema</p></div><button onClick={()=>onNavigate('inventory')} className="text-sm text-blue-700">Ver estoque</button></div>{recentMovements.length ? <div className="mt-4 divide-y">{recentMovements.slice(0,8).map(m=><div key={m.id} className="py-3 flex justify-between gap-4 text-sm"><div><div className="font-medium">{m.productName}</div><div className="text-xs text-slate-500">{m.operationType} · {m.timestamp}</div></div><div className={m.quantity>=0?'text-emerald-700':'text-slate-700'}>{m.quantity>0?'+':''}{m.quantity} {m.unit}</div></div>)}</div>:<div className="py-12 text-center text-sm text-slate-500">Ainda não há movimentações. Cadastre produtos ou importe uma nota XML para começar.</div>}</div>
    <div className="bg-white rounded-xl border border-slate-200 p-5"><h2 className="font-semibold text-slate-900">Atenção ao estoque</h2><p className="text-xs text-slate-500 mt-1">Comparação com mínimo e máximo informados</p><div className="mt-5 text-3xl font-bold text-amber-600">{lowCount}</div><p className="text-sm text-slate-500">produto(s) com risco de acabar ou zerados</p><p className="mt-4 text-sm text-blue-700">{highCount} acima do estoque máximo</p><button onClick={()=>onNavigate('products')} className="mt-4 text-sm text-blue-700">Consultar produtos</button><button onClick={onOpenStockAdjustModal} disabled={!products.length} className="mt-3 block text-sm text-blue-700 disabled:text-slate-300">Ajustar estoque</button></div></section>
    <div className="flex flex-wrap gap-3"><button onClick={onOpenNewInvoiceModal} className="text-sm text-blue-700">Registrar documento de saída</button></div>
  </div>;
};
