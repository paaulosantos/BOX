import React, { useState } from 'react';
import { Product } from '../../types';

interface FiscalDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onSaveFiscal: (productId: string, ncm: string, icms: string, cfop: string) => void;
}

export const FiscalDetailsModal: React.FC<FiscalDetailsModalProps> = ({
  product,
  onClose,
  onSaveFiscal,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [ncm, setNcm] = useState(product?.ncm || '');
  const [icms, setIcms] = useState(product?.icms || '');
  const [cfop, setCfop] = useState(product?.cfop || '5102');

  if (!product) return null;

  const handleSave = () => {
    onSaveFiscal(product.id, ncm, icms, cfop);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Ficha Fiscal &amp; Tributária
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">{product.name}</h3>
            <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {!isEditing ? (
          <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Código NCM</span>
              <span className="font-semibold text-slate-800 text-sm font-mono">{product.ncm}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Alíquota ICMS</span>
              <span className="font-semibold text-slate-800 text-sm font-mono">{product.icms}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">CFOP Padrão</span>
              <span className="font-semibold text-slate-800 text-sm font-mono">{product.cfop} (Interno)</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Saldo Físico</span>
              <span className="font-semibold text-slate-800 text-sm font-mono">
                {product.stock} {product.unit}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 py-2 border-y border-slate-100">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Código NCM</label>
              <input
                type="text"
                value={ncm}
                onChange={(e) => setNcm(e.target.value)}
                className="w-full h-8 px-3 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Alíquota ICMS</label>
              <input
                type="text"
                value={icms}
                onChange={(e) => setIcms(e.target.value)}
                className="w-full h-8 px-3 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">CFOP Padrão</label>
              <input
                type="text"
                value={cfop}
                onChange={(e) => setCfop(e.target.value)}
                className="w-full h-8 px-3 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
          {!isEditing ? (
            <button
              onClick={() => {
                setNcm(product.ncm);
                setIcms(product.icms);
                setCfop(product.cfop);
                setIsEditing(true);
              }}
              className="px-4 py-2 text-xs font-semibold bg-[#004ac6] hover:bg-blue-700 text-white rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              Editar Cadastro Fiscal
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              Salvar Alterações
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
