import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  stockAlertCount?: number;
  pendingInvoiceCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  stockAlertCount = 24,
  pendingInvoiceCount = 2,
}) => {
  const menuItems: { id: ViewType; label: string; icon: string; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Visão Geral', icon: 'dashboard' },
    { id: 'products', label: 'Produtos & Estoque', icon: 'inventory_2', badge: stockAlertCount, badgeColor: 'bg-[#FFF1DC] text-[#FF8500] border border-[#FFD2A6]/60' },
    { id: 'inventory', label: 'Estoque & Movimentações', icon: 'warehouse' },
    { id: 'invoices', label: 'Notas Fiscais & XML', icon: 'receipt_long', badge: pendingInvoiceCount, badgeColor: 'bg-[#FFF1DC] text-[#FF8500] border border-[#FFD2A6]/60' },
    { id: 'sales', label: 'Vendas & PDV', icon: 'point_of_sale' },
    { id: 'purchases', label: 'Compras', icon: 'local_shipping' },
    { id: 'finance', label: 'Financeiro', icon: 'payments' },
  ];

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-60 bg-white border-r border-[#FFD2A6]/40 z-30 flex flex-col justify-between py-4 select-none">
      <div className="flex flex-col gap-1 px-3">
        <div className="px-3 pb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#3D405B]/60 uppercase tracking-wider">
            Módulos ERP
          </span>
          <span className="text-[10px] text-slate-400 font-mono">v4.0</span>
        </div>

        <nav className="flex flex-col gap-0.5">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                  isActive
                    ? 'bg-[#FFF1DC] text-[#FF8500] font-semibold shadow-2xs'
                    : 'text-[#3D405B]/80 hover:bg-[#FFF1DC]/40 hover:text-[#3D405B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[18px] transition-colors ${
                      isActive ? 'text-[#FF8500]' : 'text-[#3D405B]/60'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && item.badge > 0 ? (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* SEFAZ Status at Bottom */}
      <div className="px-4">
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium text-slate-700">SEFAZ Operacional</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
            Amb. Prod
          </span>
        </div>
      </div>
    </aside>
  );
};
