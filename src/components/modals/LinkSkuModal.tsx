import React, { useState } from 'react';
import { Product } from '../../types';

interface LinkSkuModalProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onLink: (itemId: string, sku: string) => void;
}

export const LinkSkuModal: React.FC<LinkSkuModalProps> = ({
  item,
  isOpen,
  onClose,
  products,
  onLink,
}) => {
  const [selectedSku, setSelectedSku] = useState(products[0]?.sku || 'NX-EL-8821');

  if (!isOpen || !item) return null;

  const handleSave = () => {
    onLink(item.id, selectedSku);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Vincular SKU ao Produto do XML</h3>
            <p className="text-xs text-slate-500">Faça o de-para com o catálogo interno da empresa</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Item do Fornecedor</span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{item.name}</p>
            <p className="text-slate-500 font-mono text-xs mt-1">
              Quantidade: {item.quantity} {item.unit} • Valor: R$ {item.unitPrice.toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Selecione o SKU no Sistema</label>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              className="w-full h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#004ac6]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.sku}>
                  {p.sku} — {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#004ac6] hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Confirmar Vínculo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
