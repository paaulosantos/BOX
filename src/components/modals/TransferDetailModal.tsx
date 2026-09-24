import React from 'react';
import { Transfer } from '../../types';

interface TransferDetailModalProps {
  transfer: Transfer | null;
  onClose: () => void;
  onCompleteTransfer: (id: string) => void;
}

export const TransferDetailModal: React.FC<TransferDetailModalProps> = ({
  transfer,
  onClose,
  onCompleteTransfer,
}) => {
  if (!transfer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-[#004ac6] bg-blue-50 px-2.5 py-1 rounded">
              {transfer.code}
            </span>
            <span className="text-xs text-slate-500 font-medium">Rastreamento de Transferência</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs">
          {/* Header Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 flex justify-between items-center">
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Item da Carga</span>
              <span className="font-bold text-slate-900 text-sm">{transfer.description}</span>
            </div>
            <span className="px-2.5 py-1 bg-sky-100 text-sky-800 rounded-full font-semibold text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
              {transfer.status}
            </span>
          </div>

          {/* Logistics Steps */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 text-xs">Linha do Tempo Logística</h4>

            <div className="relative pl-6 border-l-2 border-blue-500 space-y-4">
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                <p className="font-semibold text-slate-900">Mercadoria Coletada &amp; Despachada</p>
                <p className="text-slate-500 text-[11px]">{transfer.originBranch} • NF-e de Remessa autorizada</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-100 animate-pulse" />
                <p className="font-semibold text-slate-900">Em Transporte Rodoviário</p>
                <p className="text-slate-500 text-[11px]">Motorista: Rodolfo Valente • Placa: BRA-4X91</p>
              </div>

              <div className="relative opacity-60">
                <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-300 ring-4 ring-slate-100" />
                <p className="font-semibold text-slate-700">Chegada e Descarregamento</p>
                <p className="text-slate-400 text-[11px]">Destino: {transfer.destinationBranch} • Previsão: {transfer.eta}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 text-slate-700 text-xs flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#004ac6] text-base mt-0.5">local_shipping</span>
            <div>
              <p className="font-semibold text-slate-900">Documento Fiscal Eletrônico Vinculado</p>
              <p className="text-slate-500 text-[11px]">MDF-e 000.019.201 autorizado junto à SEFAZ Interestadual.</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
            >
              Fechar
            </button>
            <button
              onClick={() => {
                onCompleteTransfer(transfer.id);
                onClose();
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Confirmar Recebimento</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
