import React, { useState } from 'react';

interface AccessKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsultKey: (key: string) => void;
}

export const AccessKeyModal: React.FC<AccessKeyModalProps> = ({
  isOpen,
  onClose,
  onConsultKey,
}) => {
  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessKey.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConsultKey(accessKey);
      setAccessKey('');
      onClose();
    }, 600);
  };

  const handleFormatKey = (value: string) => {
    // Remove non digits
    const cleaned = value.replace(/\D/g, '').slice(0, 44);
    // Group in 4s
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setAccessKey(formatted);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white max-w-md w-full rounded-xl shadow-2xl border border-slate-200 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Consultar Chave de Acesso</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Insira a chave de 44 dígitos da NF-e para consultar o status diretamente na SEFAZ e baixar o XML.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Chave da Nota Fiscal</label>
            <input
              type="text"
              value={accessKey}
              onChange={(e) => handleFormatKey(e.target.value)}
              placeholder="3524 1012 3456 7800 0190 5500 1000 0482 9112 3456 7892"
              className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6]"
              required
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Dígitos inseridos: {accessKey.replace(/\s/g, '').length} / 44</span>
            <button
              type="button"
              onClick={() => handleFormatKey("35241012345678000190550010000482911234567892")}
              className="text-[#004ac6] hover:underline cursor-pointer"
            >
              Preencher exemplo
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#004ac6] text-white hover:bg-blue-700 shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                  <span>Consultando SEFAZ...</span>
                </>
              ) : (
                <span>Buscar Nota</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
