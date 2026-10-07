import React, { useState, useEffect, useRef } from 'react';
import { ASSETS } from '../data/initialData';
import { ViewType } from '../types';

interface HeaderProps {
  onNavigate: (view: ViewType) => void;
  currentView?: ViewType;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTriggerToast: (title: string, desc?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  searchQuery,
  onSearchChange,
  onTriggerToast,
}) => {
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
        <span className="text-xs text-slate-500">Estoque geral</span>
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

    </header>
  );
};
