import React, { useState, useEffect, useRef } from 'react';
import { ASSETS } from '../data/initialData';
import { ViewType } from '../types';

interface HeaderProps {
  currentBranch: string;
  onBranchChange: (branch: string) => void;
  onNavigate: (view: ViewType) => void;
  currentView?: ViewType;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  unreadCount?: number;
  onTriggerToast: (title: string, desc?: string) => void;
  onOpenImageLinks?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentBranch,
  onBranchChange,
  onNavigate,
  currentView,
  searchQuery,
  onSearchChange,
  unreadCount = 2,
  onTriggerToast,
  onOpenImageLinks,
}) => {
  const [branchOpen, setBranchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut ⌘K or Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        onTriggerToast("Busca Rápida ativada", "Digite para localizar produtos, notas ou transferências");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTriggerToast]);

  const branches = [
    { id: 'matriz', name: 'Filial Matriz - SP #01', state: 'SP' },
    { id: 'curitiba', name: 'CD Curitiba - PR #02', state: 'PR' },
    { id: 'rio', name: 'Filial Rio de Janeiro #03', state: 'RJ' },
  ];

  const currentBranchObj = branches.find(b => b.id === currentBranch) || branches[0];

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white z-40 border-b border-[#FFD2A6]/40 flex items-center justify-between px-6 select-none">
      {/* Brand & Branch Selector */}
      <div className="flex items-center gap-4 min-w-[260px]">
        <button 
          onClick={() => onNavigate('dashboard')} 
          className="flex items-center gap-2.5 focus:outline-none group cursor-pointer text-left"
        >
          <img
            src={ASSETS.logo}
            alt="Box Logo"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </button>

        <div className="h-4 w-px bg-slate-200" />

        {/* Branch Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setBranchOpen(!branchOpen);
              setNotifOpen(false);
              setProfileOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-[#FF8500]">store</span>
            <span className="truncate max-w-[130px] font-medium text-slate-800">{currentBranchObj.name}</span>
            <span className="material-symbols-outlined text-[15px] text-slate-400">expand_more</span>
          </button>

          {branchOpen && (
            <div className="absolute left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Alternar Filial Ativa
              </div>
              {branches.map(b => (
                <button
                  key={b.id}
                  onClick={() => {
                    onBranchChange(b.id);
                    setBranchOpen(false);
                    onTriggerToast(`Filial alterada`, `Você agora está operando em ${b.name}`);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#FFF1DC]/50 transition-colors ${
                    currentBranch === b.id ? 'font-semibold text-[#FF8500] bg-[#FFF1DC]' : 'text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${currentBranch === b.id ? 'bg-[#FF8500]' : 'bg-slate-300'}`} />
                    {b.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">{b.state}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-lg mx-6">
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3 text-[18px] text-slate-400 pointer-events-none">
            search
          </span>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar produto, código ou transferência... (⌘K)"
            className="w-full h-8 pl-9 pr-14 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 rounded-lg border border-slate-200 focus:outline-none focus:border-[#FF8500] focus:ring-1 focus:ring-[#FF8500]/20 focus:bg-white transition-all shadow-2xs"
          />
          <span className="absolute right-2.5 text-[10px] text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono pointer-events-none">
            ⌘K
          </span>
        </div>
      </div>

      {/* Notifications & Profile */}
      <div className="flex items-center gap-3">
        {onOpenImageLinks && (
          <button
            onClick={onOpenImageLinks}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-[#FF8500] hover:bg-[#FFF1DC] border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Ver telas do HTML e referências de imagens"
          >
            <span className="material-symbols-outlined text-[16px] text-[#FF8500]">photo_library</span>
            <span>Telas HTML</span>
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setBranchOpen(false);
              setProfileOpen(false);
            }}
            className="relative p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Central de Notificações"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-[#FF8500] ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-1 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-800">Notificações Operacionais</span>
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  SEFAZ 100% On
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-1">
                <div 
                  onClick={() => {
                    onNavigate('invoices');
                    setNotifOpen(false);
                  }}
                  className="py-2.5 px-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF8500] flex-shrink-0" />
                    <span className="text-xs font-medium text-slate-800">Nova NF-e 000.048.291 importada</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 pl-3.5">TechBrasil Distribuidora • R$ 45.320,00</p>
                  <span className="text-[10px] text-slate-400 pl-3.5 block mt-0.5">Há 14 minutos</span>
                </div>
                <div 
                  onClick={() => {
                    onNavigate('inventory');
                    setNotifOpen(false);
                  }}
                  className="py-2.5 px-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-slate-800">Transferência TRF-2024-089 em trânsito</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 pl-3.5">120x Fonte Bivolt 60W • Chegada prevista 17:00</p>
                  <span className="text-[10px] text-slate-400 pl-3.5 block mt-0.5">Hoje às 13:48</span>
                </div>
                <div 
                  onClick={() => {
                    onNavigate('products');
                    setNotifOpen(false);
                  }}
                  className="py-2.5 px-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-slate-800">Alerta de Estoque Zerado</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 pl-3.5">Bobina Filme Stretch Manual 500mm atingiu 0 un</p>
                  <span className="text-[10px] text-slate-400 pl-3.5 block mt-0.5">Ontem às 18:00</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setBranchOpen(false);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <img
              src={ASSETS.userMariana}
              alt="Profile Mariana Silva"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
              referrerPolicy="no-referrer"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 leading-tight">Mariana Silva</span>
              <span className="text-[11px] text-slate-400">Gerente de Operações</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-slate-400 hidden lg:block">expand_more</span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800">Mariana Silva</p>
                <p className="text-[11px] text-slate-400">mariana.silva@box.com.br</p>
                <span className="inline-block mt-1 text-[10px] font-semibold bg-[#FFF1DC] text-[#FF8500] border border-[#FFD2A6]/60 px-1.5 py-0.5 rounded">
                  Acesso Administrador
                </span>
              </div>
              <div className="py-1 text-xs text-slate-700">
                <button 
                  onClick={() => {
                    onTriggerToast("Configurações do Sistema", "Ambiente de produção SEFAZ v4.0");
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px] text-slate-400">settings</span>
                  Configurações do Box
                </button>
                <button 
                  onClick={() => {
                    onTriggerToast("Certificado Digital A1", "Válido até 18/11/2027");
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px] text-slate-400">verified_user</span>
                  Certificado Digital A1
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
