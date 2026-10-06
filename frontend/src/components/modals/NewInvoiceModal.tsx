import React, { useState } from 'react';
import { Product, Invoice } from '../../types';

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  docTypeDefault?: 'NF-e' | 'NFC-e';
  onEmitInvoice: (invoice: Omit<Invoice, 'id'>) => void;
}

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  isOpen,
  onClose,
  products,
  docTypeDefault = 'NF-e',
  onEmitInvoice,
}) => {
  const [docType, setDocType] = useState<'NF-e' | 'NFC-e'>(docTypeDefault);
  const [partyName, setPartyName] = useState('Distribuidora Nacional de Peças SA');
  const [taxId, setTaxId] = useState('02.481.992/0001-30');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.id === selectedProductId) || products[0];
  const amount = currentProduct ? currentProduct.salePrice * quantity : 0;

  const handleEmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const randomNum = Math.floor(Math.random() * 900) + 100;
      onEmitInvoice({
        number: `${docType} 000.010.${randomNum}`,
        series: docType === 'NF-e' ? 'Série 1' : 'Série 2',
        type: 'Saída',
        partyName,
        taxId,
        date: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        amount,
        status: 'Autorizada',
        accessKey: '3524 ' + Array.from({ length: 10 }, () => Math.floor(Math.random() * 9000) + 1000).join(' '),
        docType,
        xmlAvailable: true,
      });
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {docType === 'NFC-e' ? 'Emitir NFC-e (Cupom Fiscal)' : 'Emitir Nota Fiscal Eletrônica (NF-e)'}
            </h3>
            <p className="text-xs text-slate-500">Transmissão em tempo real e assinatura com Certificado A1</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleEmit} className="p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setDocType('NF-e')}
              className={`px-3.5 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                docType === 'NF-e' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Modelo 55 (NF-e)
            </button>
            <button
              type="button"
              onClick={() => setDocType('NFC-e')}
              className={`px-3.5 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                docType === 'NFC-e' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Modelo 65 (NFC-e)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Destinatário</label>
              <input
                type="text"
                required
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
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
              <label className="block font-medium text-slate-700 mb-1">Produto / Serviço</label>
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
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#004ac6]"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Valor Total</span>
              <span className="text-xl font-bold text-slate-900 font-mono">
                R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-right">
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded text-xs font-semibold">
                Certificado Digital A1 Válido
              </span>
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
              disabled={isProcessing}
              className="px-5 py-2 bg-[#004ac6] hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  <span>Transmitindo à SEFAZ...</span>
                </>
              ) : (
                <span>Transmitir e Autorizar</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
