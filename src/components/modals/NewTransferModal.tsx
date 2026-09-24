import React, { useState } from 'react';
import { Product, Transfer } from '../../types';

interface NewTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddTransfer: (transfer: Omit<Transfer, 'id'>) => void;
}

export const NewTransferModal: React.FC<NewTransferModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddTransfer,
}) => {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(50);
  const [origin, setOrigin] = useState('Matriz SP');
  const [destination, setDestination] = useState('CD Curitiba');
  const [eta, setEta] = useState('Hoje às 19:30');

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const codeNum = Math.floor(Math.random() * 90) + 10;
    onAddTransfer({
      code: `TRF-2024-0${codeNum}`,
      productName: currentProduct.name,
      quantity,
      originBranch: origin,
      destinationBranch: destination,
      status: 'Em Rota',
      eta,
      description: `${quantity}x ${currentProduct.name}`,
      progressPercent: 20,
      trackingCode: `BR-TRF-${codeNum}99`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Nova Transferência entre Filiais</h3>
            <p className="text-xs text-slate-500">Gerencie remessas de mercadorias com CFOP 5152/6152</p>
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
            <label className="block font-medium text-slate-700 mb-1">Item a Transferir</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#004ac6]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Disponível: {p.stock} {p.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Filial de Origem</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#004ac6]"
              >
                <option value="Matriz SP">Matriz SP</option>
                <option value="CD Curitiba">CD Curitiba</option>
                <option value="Hub Rio">Hub Rio</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Filial de Destino</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#004ac6]"
              >
                <option value="CD Curitiba">CD Curitiba</option>
                <option value="Matriz SP">Matriz SP</option>
                <option value="Hub Rio">Hub Rio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Quantidade</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#004ac6]"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Previsão de Entrega</label>
              <input
                type="text"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#004ac6]"
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
              Iniciar Transferência
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
