import React from 'react';
import { Invoice } from '../../types';

interface DanfeViewerModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onPrint: () => void;
}

export const DanfeViewerModal: React.FC<DanfeViewerModalProps> = ({
  invoice,
  onClose,
  onPrint,
}) => {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-blue-400">description</span>
            <div>
              <span className="font-semibold text-sm">
                {invoice.docType === 'NFC-e' ? 'DANFE NFC-e - Documento Auxiliar' : 'DANFE NF-e - Documento Auxiliar da Nota Fiscal'}
              </span>
              <span className="text-[11px] text-slate-400 block font-mono">{invoice.number} • {invoice.series}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">print</span>
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Simulated DANFE Container */}
        <div className="p-6 overflow-y-auto space-y-4 font-sans text-slate-800 text-xs bg-slate-50/50">
          {/* Header Box */}
          <div className="border border-slate-300 bg-white p-4 rounded-lg">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3 mb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900 uppercase">Box Distribuição e Logística LTDA</h4>
                <p className="text-[11px] text-slate-500">Av. Paulista, 1000 - Bela Vista - São Paulo - SP</p>
                <p className="text-[11px] text-slate-500 font-mono">CNPJ: 10.450.880/0001-22 • IE: 114.590.221.110</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 rounded text-xs uppercase">
                  SEFAZ: Protocolo Autorizado
                </span>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">Prot: 135240098442110</p>
              </div>
            </div>

            {/* Chave de Acesso */}
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Chave de Acesso</span>
              <span className="font-mono text-xs font-bold text-slate-900 tracking-wider select-all">
                {invoice.accessKey}
              </span>
            </div>
          </div>

          {/* Destinatário / Remetente */}
          <div className="border border-slate-300 bg-white p-4 rounded-lg">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
              {invoice.type === 'Saída' ? 'Destinatário / Remetente' : 'Emitente / Fornecedor'}
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Nome / Razão Social</span>
                <span className="font-semibold text-slate-800">{invoice.partyName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">CNPJ / CPF</span>
                <span className="font-semibold text-slate-800 font-mono">{invoice.taxId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Data de Emissão</span>
                <span className="font-medium text-slate-700">{invoice.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Natureza da Operação</span>
                <span className="font-medium text-slate-700">Venda de mercadoria adquirida (CFOP 5102)</span>
              </div>
            </div>
          </div>

          {/* Totais */}
          <div className="border border-slate-300 bg-white p-4 rounded-lg">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
              Cálculo do Imposto &amp; Totais
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Base Cálc. ICMS</span>
                <span className="font-mono font-semibold">R$ {(invoice.amount * 0.82).toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Valor do ICMS</span>
                <span className="font-mono font-semibold text-blue-700">R$ {(invoice.amount * 0.18).toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Valor do Frete</span>
                <span className="font-mono font-semibold">R$ 0,00</span>
              </div>
              <div className="bg-blue-50/60 p-2 rounded border border-blue-200">
                <span className="text-[10px] text-[#004ac6] font-bold block">Valor Total da Nota</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  R$ {invoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Emissão Eletrônica Autorizada pela SEFAZ Nacional</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Fechar Visualização
          </button>
        </div>
      </div>
    </div>
  );
};
