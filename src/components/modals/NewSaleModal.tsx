import React, { useState } from 'react';
import { Product } from '../../types';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onCompleteSale: (saleData: {
    clientName: string;
    taxId: string;
    productId: string;
    quantity: number;
    totalAmount: number;
    emitNfe: boolean;
  }) => void;
}

export const NewSaleModal: React.FC<NewSaleModalProps> = ({
  isOpen,
  onClose,
  products,
  onCompleteSale,
}) => {
  const [clientName, setClientName] = useState('Tech Solutions Indústria');
  const [taxId, setTaxId] = useState('44.912.839/0001-55');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(5);
  const [emitNfe, setEmitNfe] = useState<boolean>(true);

  if (!isOpen) return null;

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const totalAmount = currentProduct ? currentProduct.salePrice * quantity : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCompleteSale({
      clientName,
      taxId,
      productId: currentProduct.id,
      quantity,
      totalAmount,
      emitNfe,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Nova Venda / Faturamento</h3>
            <p className="text-xs text-slate-500">Registre uma venda e dê baixa imediata no estoque</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Cliente / Destinatário</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#004ac6]"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">CNPJ / CPF</label>
              <input
                type="text"
                required
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#004ac6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-medium text-slate-700 mb-1">Item da Venda</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#004ac6]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (R$ {p.salePrice.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Quantidade</label>
              <input
                type="number"
                min="1"
                max={currentProduct?.stock || 999}
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#004ac6]"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px] font-medium uppercase">Total do Pedido</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">
                R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={emitNfe}
                onChange={(e) => setEmitNfe(e.target.checked)}
                className="rounded text-[#004ac6] focus:ring-0"
              />
              <span className="font-semibold text-slate-700 text-xs">Emitir NF-e automaticamente</span>
            </label>
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
              type="submit"
              className="px-5 py-2 bg-[#004ac6] hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Confirmar e Faturar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
