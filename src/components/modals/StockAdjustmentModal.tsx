import React, { useState, useEffect } from 'react';
import { Product } from '../../types';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveAdjustment: (productId: string, newStock: number, reason: string, observation: string) => void;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  products,
  onSaveAdjustment,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [novoSaldo, setNovoSaldo] = useState<number>(0);
  const [motivo, setMotivo] = useState<string>('avaria');
  const [observacao, setObservacao] = useState<string>('Avaria na carcaça externa constatada');

  useEffect(() => {
    if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
      setNovoSaldo(products[0].stock);
    }
  }, [products, selectedProductId]);

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedProductId(id);
    const prod = products.find(p => p.id === id);
    if (prod) {
      setNovoSaldo(prod.stock);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;
    onSaveAdjustment(currentProduct.id, novoSaldo, motivo, observacao);
    onClose();
  };

  const diff = currentProduct ? novoSaldo - currentProduct.stock : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-base text-slate-900">Ajuste de Estoque</h3>
            <p className="text-xs text-slate-500">Lançamento de conferência e inventário</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-700">Produto</label>
            <select
              value={selectedProductId}
              onChange={handleProductChange}
              className="w-full h-9 px-3 bg-slate-50 text-xs rounded-lg border border-slate-200 focus:ring-1 focus:ring-primary focus:bg-white focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200/60">
            <div>
              <span className="text-[11px] text-slate-400 font-medium uppercase">Saldo Atual</span>
              <p className="text-xl font-bold text-slate-900 mt-0.5 font-mono">
                {currentProduct?.stock} {currentProduct?.unit}
              </p>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 font-medium uppercase block">Novo Saldo</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={novoSaldo}
                  onChange={(e) => setNovoSaldo(Number(e.target.value))}
                  required
                  className="h-8 mt-0.5 px-2.5 bg-white text-slate-900 font-bold text-base rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary w-full font-mono"
                />
                {diff !== 0 && (
                  <span className={`text-xs font-bold font-mono whitespace-nowrap ${diff > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {diff > 0 ? `+${diff}` : diff}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-700">Motivo</label>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 text-xs rounded-lg border border-slate-200 focus:ring-1 focus:ring-primary focus:bg-white focus:outline-none"
              required
            >
              <option value="avaria">Avaria ou Perda Física</option>
              <option value="inventario">Contagem Periódica</option>
              <option value="correcao">Correção de Digitação</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-700">Observação</label>
            <input
              type="text"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: Produto danificado no recebimento"
              required
              className="w-full h-9 px-3 bg-slate-50 text-xs rounded-lg border border-slate-200 focus:ring-1 focus:ring-primary focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-9 px-4 bg-[#004ac6] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              Salvar Ajuste
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
