import React, { useState } from 'react';
import { ViewType } from '../../types';

interface ImageLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScreen: (screen: ViewType) => void;
}

export const ImageLinksModal: React.FC<ImageLinksModalProps> = ({
  isOpen,
  onClose,
  onSelectScreen,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const screens = [
    {
      id: 'dashboard' as ViewType,
      title: '1. Painel Operacional (Dashboard)',
      desc: 'Resumo de faturamento, saldo total de estoque, gráfico semestral e tabela de movimentações em tempo real.',
      tag: 'Tela 4 do Mockup',
    },
    {
      id: 'products' as ViewType,
      title: '2. Produtos & Catálogo (Estoque)',
      desc: 'Listagem de SKUs, métricas rápidas de disponibilidade, filtros em pílula e fichas fiscais NCM/ICMS.',
      tag: 'Tela 3 do Mockup',
    },
    {
      id: 'inventory' as ViewType,
      title: '3. Estoque & Movimentações',
      desc: 'Indicadores por filial (Matriz SP / CD Curitiba), remessas em trânsito com barra de rota e auditoria.',
      tag: 'Tela 1 do Mockup',
    },
    {
      id: 'invoices' as ViewType,
      title: '4. Notas Fiscais & XML',
      desc: 'Área de upload de arquivos XML, conciliação e vínculo de SKUs, consulta por chave de 44 dígitos e DANFE.',
      tag: 'Tela 2 do Mockup',
    },
  ];

  const codeSnippets = [
    {
      title: '1. Imagem via URL Pública Direta (CDN ou Hospedagem)',
      code: `<img \n  src="https://sua-empresa.com/imagens/produto-01.png" \n  alt="Produto" \n  class="w-10 h-10 rounded-lg object-cover" \n/>`,
    },
    {
      title: '2. Imagem da pasta local do projeto (/public)',
      code: `<!-- Coloque o arquivo em /public/assets/imagens/ -->\n<img \n  src="/assets/imagens/logo.png" \n  alt="Logo Box" \n  class="h-7 w-auto" \n/>`,
    },
    {
      title: '3. Imagem embutida em Base64 (sem dependência externa)',
      code: `<img \n  src="data:image/svg+xml;utf8,<svg ...></svg>" \n  alt="Ícone" \n/>`,
    },
  ];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/75">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#004ac6]">image</span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Links Diretos para Imagens no HTML &amp; Telas</h3>
              <p className="text-xs text-slate-500">Como vincular imagens e navegar entre as telas geradas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Explanation banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <span className="material-symbols-outlined text-[#004ac6] text-sm">info</span>
              Sim! É totalmente possível adicionar links diretos para imagens no HTML
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              No HTML e no React você pode usar links HTTP/HTTPS diretos em atributos <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-[10px]">src="..."</code>, referenciar imagens da pasta <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-[10px]">/public</code> ou usar ícones vetoriais em tempo real. Veja os exemplos de sintaxe abaixo:
            </p>
          </div>

          {/* Code snippets */}
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Formas de Inserir Imagens no HTML
            </span>
            {codeSnippets.map((snip, idx) => (
              <div key={idx} className="bg-slate-900 rounded-xl p-3.5 text-white font-mono text-[11px] relative">
                <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[10px] font-sans">
                  <span>{snip.title}</span>
                  <button
                    onClick={() => copyToClipboard(snip.code, idx)}
                    className="hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {copiedIndex === idx ? 'done' : 'content_copy'}
                    </span>
                    <span>{copiedIndex === idx ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <pre className="overflow-x-auto text-emerald-400">{snip.code}</pre>
              </div>
            ))}
          </div>

          {/* Quick navigation to the 4 implemented screens */}
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Telas Criadas Baseadas nas suas Imagens
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {screens.map((scr) => (
                <div
                  key={scr.id}
                  onClick={() => {
                    onSelectScreen(scr.id);
                    onClose();
                  }}
                  className="p-3.5 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300 border border-slate-200 rounded-xl cursor-pointer transition-all flex flex-col justify-between gap-2 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 group-hover:text-primary transition-colors text-xs">
                        {scr.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {scr.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{scr.desc}</p>
                  </div>
                  <span className="text-[11px] font-medium text-[#004ac6] flex items-center gap-1 mt-1">
                    Abrir esta tela <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Entendido, fechar
          </button>
        </div>
      </div>
    </div>
  );
};
