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
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [eta, setEta] = useState('');

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;
    onAddTransfer({
      code: '',
      productName: currentProduct.name,
      quantity,
      originBranch: origin,
      destinationBranch: destination,
      status: 'Em Separação',
      eta,
      description: `${quantity}x ${currentProduct.name}`,
      progressPercent: 0,
      trackingCode: '',
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
              required
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
            {!products.length && <p className="mt-1 text-amber-700">Cadastre ao menos um produto antes de criar uma transferência.</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Filial de Origem</label>
              <input
                required
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#004ac6]"
                placeholder="Local de origem"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Filial de Destino</label>
              <input
                required
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#004ac6]"
                placeholder="Local de destino"
              />
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
              disabled={!products.length}
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
