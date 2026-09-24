import React from 'react';
import { ViewType } from '../../types';

interface GenericModuleViewProps {
  module: ViewType;
  onNavigate: (view: ViewType) => void;
  onOpenNewSale: () => void;
  onOpenNewInvoice: () => void;
}

export const GenericModuleView: React.FC<GenericModuleViewProps> = ({
  module,
  onNavigate,
  onOpenNewSale,
  onOpenNewInvoice,
}) => {
  const infoMap: Record<string, { title: string; subtitle: string; icon: string; stats: string }> = {
    sales: {
      title: 'Vendas & PDV',
      subtitle: 'Controle de caixas, balcão de vendas e emissão imediata de NFC-e',
      icon: 'point_of_sale',
      stats: '42 pedidos faturados hoje • R$ 24.890,00',
    },
    purchases: {
      title: 'Gestão de Compras & Fornecedores',
      subtitle: 'Ordens de compra, cotações e entrada de mercadorias via XML',
      icon: 'local_shipping',
      stats: '14 pedidos aguardando entrega • R$ 180.450,00',
    },
    finance: {
      title: 'Módulo Financeiro & Fluxo de Caixa',
      subtitle: 'Contas a pagar, a receber, conciliação bancária e DRE consolidado',
      icon: 'payments',
      stats: 'Faturamento acumulado: R$ 486.320,00',
    },
  };

  const current = infoMap[module] || {
    title: 'Módulo ERP',
    subtitle: 'Gestão integrada',
    icon: 'folder',
    stats: 'Dados sincronizados',
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8 space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{current.title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{current.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {module === 'sales' && (
            <button
              onClick={onOpenNewSale}
              className="h-9 px-4 bg-[#004ac6] text-white rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">add</span>
              <span>Abrir Novo Caixa / Venda</span>
            </button>
          )}
          {module === 'finance' && (
            <button
              onClick={onOpenNewInvoice}
              className="h-9 px-4 bg-[#004ac6] text-white rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">receipt_long</span>
              <span>Lançar Faturamento</span>
            </button>
          )}
          {module === 'purchases' && (
            <button
              onClick={() => onNavigate('invoices')}
              className="h-9 px-4 bg-[#004ac6] text-white rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">upload_file</span>
              <span>Importar XML de Fornecedor</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center justify-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#004ac6] flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">{current.icon}</span>
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">{current.title} Operacional</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md">{current.stats}</p>
        </div>
        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Voltar ao Dashboard
          </button>
          <button
            onClick={() => onNavigate('products')}
            className="px-4 py-2 bg-[#004ac6] hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Ver Catálogo de Produtos
          </button>
        </div>
      </div>
    </div>
  );
};
