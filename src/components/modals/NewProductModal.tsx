import React, { useState } from 'react';
import { Product } from '../../types';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (newProduct: Omit<Product, 'id'>) => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Informática');
  const [stock, setStock] = useState<number>(100);
  const [unit, setUnit] = useState('un');
  const [costPrice, setCostPrice] = useState<number>(150);
  const [salePrice, setSalePrice] = useState<number>(249.9);
  const [ncm, setNcm] = useState('8542.31.90');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;

    onAddProduct({
      name,
      sku,
      category,
      stock,
      unit,
      minStock: 20,
      costPrice,
      salePrice,
      status: stock > 20 ? 'ok' : stock > 0 ? 'low' : 'out',
      icon: 'inventory_2',
      iconBg: 'bg-blue-50',
      iconColor: 'text-primary',
      ncm,
      icms: '18%',
      cfop: '5102',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Novo Produto</h3>
            <p className="text-xs text-slate-500">Cadastre um novo item no inventário e catálogo fiscal</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Nome do Produto</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Teclado Mecânico RGB Pro"
              className="w-full h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#004ac6]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Código SKU</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="Ex: NX-TEC-009"
                className="w-full h-9 px-3 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#004ac6]"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#004ac6]"
              >
                <option value="Hardware & Peças">Hardware &amp; Peças</option>
                <option value="Periféricos">Periféricos</option>
                <option value="Cabos & Conectores">Cabos &amp; Conectores</option>
                <option value="Eletrônica">Eletrônica</option>
                <option value="Armazenamento">Armazenamento</option>
                <option value="Redes">Redes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Estoque Inicial</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#004ac6]"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Unidade</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="un, cx, kg"
                className="w-full h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#004ac6]"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">NCM Fiscal</label>
              <input
                type="text"
                value={ncm}
                onChange={(e) => setNcm(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#004ac6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Preço de Custo (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded font-mono font-semibold"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Preço de Venda (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded font-mono font-bold text-[#004ac6]"
              />
            </div>
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
              Cadastrar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
