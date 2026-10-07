import React, { useState, useMemo } from 'react';
import { Product } from '../../types';

interface ProductsViewProps {
  products: Product[];
  onOpenNewProductModal: () => void;
  onOpenFiscalModal: (product: Product) => void;
  onOpenEditModal: (product: Product) => void;
  onOpenImportModal: () => void;
  searchQuery: string;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onOpenNewProductModal,
  onOpenFiscalModal,
  onOpenEditModal,
  onOpenImportModal,
  searchQuery,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'low' | 'out' | 'high'>('all');
  const [localSearch, setLocalSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const effectiveSearch = (searchQuery || localSearch).toLowerCase();
  const stocked = products.filter(p => p.stock > 0).length;
  const alerts = products.filter(p => p.status === 'low' || p.status === 'out').length;
  const low = products.filter(p => p.status === 'low').length;
  const out = products.filter(p => p.status === 'out').length;
  const high = products.filter(p => p.status === 'high').length;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(effectiveSearch) ||
        p.sku.toLowerCase().includes(effectiveSearch) ||
        p.category.toLowerCase().includes(effectiveSearch);

      if (!matchesSearch) return false;
      if (filterTab === 'low') return p.status === 'low';
      if (filterTab === 'out') return p.status === 'out';
      if (filterTab === 'high') return p.status === 'high';
      return true;
    });
  }, [products, effectiveSearch, filterTab]);
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="max-w-7xl mx-auto px-8 py-8 space-y-8 select-none">
      {/* Header & Ações */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Produtos &amp; Estoque</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie itens cadastrados, níveis de inventário e margens com agilidade.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenImportModal}
            className="h-10 px-4 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg text-slate-500">upload_file</span>
            <span>Importar</span>
          </button>
          <button
            onClick={onOpenNewProductModal}
            className="h-10 px-5 bg-[#FF8500] hover:bg-[#e67700] text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>+ Novo Produto</span>
          </button>
        </div>
      </div>

      {/* 3 Métricas Rápidas e Limpas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total de Produtos</span>
            <span className="material-symbols-outlined text-slate-400">inventory_2</span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight font-mono">{products.length}</span>
            <span className="text-xs font-medium text-slate-400">SKUs cadastrados</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500"><span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Estoque acima do máximo</span><span className="material-symbols-outlined text-blue-500">trending_up</span></div>
          <div className="mt-4"><span className="text-3xl font-bold text-blue-600 font-mono">{high}</span><span className="text-xs text-slate-500 ml-2">produtos</span></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Em Estoque</span>
            <span className="material-symbols-outlined text-emerald-500">check_circle</span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600 tracking-tight font-mono">{stocked}</span>
            <span className="text-xs font-medium text-emerald-700/80 bg-emerald-50 px-2 py-0.5 rounded-full">
              produtos com saldo
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Precisam de Reposição</span>
            <span className="material-symbols-outlined text-amber-500">error_outline</span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-600 tracking-tight font-mono">{alerts}</span>
            <span className="text-xs font-medium text-amber-700/80 bg-amber-50 px-2 py-0.5 rounded-full">
              {low} baixos • {out} zerados
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Pesquisa Limpa & 3 Filtros em Pílulas */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Input de Busca */}
        <div className="relative w-full sm:w-96">
          <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Buscar por produto, SKU ou categoria..."
            className="w-full h-10 pl-10 pr-4 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF8500]/20 focus:border-[#FF8500] focus:bg-white transition-all shadow-2xs"
          />
        </div>

        {/* Pílulas de Filtro */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'text-slate-800 bg-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterTab('low')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterTab === 'low'
                ? 'text-slate-800 bg-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Estoque Baixo
          </button>
          <button
            onClick={() => setFilterTab('out')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterTab === 'out'
                ? 'text-slate-800 bg-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sem Estoque
          </button>
          <button onClick={()=>setFilterTab('high')} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${filterTab==='high'?'text-slate-800 bg-white shadow-xs font-semibold':'text-slate-500 hover:text-slate-800'}`}>Estoque Alto</button>
        </div>
      </div>

      {/* Tabela Espaçosa e Arejada */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Produto</th>
              <th className="py-4 px-6">Categoria</th>
              <th className="py-4 px-6">Fornecedor / Nota</th>
                <th className="py-4 px-6">Saldo em Estoque</th>
                <th className="py-4 px-6 text-right">Preço de Custo</th>
                <th className="py-4 px-6 text-right">Preço de Venda</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    Nenhum produto encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl ${prod.iconBg} ${prod.iconColor} flex items-center justify-center flex-shrink-0`}
                        >
                          {prod.image ? <img src={prod.image} alt={prod.name} className="w-full h-full object-cover rounded-xl" /> : <span className="material-symbols-outlined text-xl">{prod.icon}</span>}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 text-sm">{prod.name}</span>
                          <span className="text-xs text-slate-400 font-normal">SKU: {prod.sku}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-500 font-normal">{prod.category}</td>
                    <td className="py-4 px-6 text-slate-500 font-normal"><div>{prod.supplier || '—'}</div><div className="text-[11px] text-slate-400">{prod.invoiceNumber || 'Sem nota de entrada'}</div></td>

                    <td className="py-4 px-6">
                      {prod.status === 'ok' && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>{prod.stock} {prod.unit} em estoque</span>
                        </div>
                      )}
                      {prod.status === 'low' && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          <span>{prod.stock} {prod.unit} (baixo)</span>
                        </div>
                      )}
                      {prod.status === 'out' && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          <span>Sem estoque</span>
                        </div>
                      )}
                      {prod.status === 'high' && <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"><span>{prod.stock} {prod.unit} (acima do máximo)</span></div>}
                    </td>

                    <td className="py-4 px-6 text-right font-normal text-slate-600 font-mono">
                      R$ {prod.costPrice.toFixed(2).replace('.', ',')}
                    </td>

                    <td className="py-4 px-6 text-right font-semibold text-slate-900 font-mono">
                      R$ {prod.salePrice.toFixed(2).replace('.', ',')}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onOpenFiscalModal(prod)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF8500] hover:bg-[#FFF1DC] transition-colors cursor-pointer"
                          title="Ver detalhes fiscais"
                        >
                          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        </button>
                        <button
                          onClick={() => onOpenEditModal(prod)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Editar cadastro"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{filteredProducts.length ? `Exibindo ${(currentPage - 1) * pageSize + 1} a ${Math.min(currentPage * pageSize, filteredProducts.length)} de ${filteredProducts.length} itens` : `0 itens`}</span>
          <div className="flex gap-2"><button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} className="px-3 py-1.5 border rounded disabled:opacity-40">Anterior</button><span className="px-3 py-1.5">Página {currentPage} de {pageCount}</span><button onClick={()=>setCurrentPage(p=>Math.min(pageCount,p+1))} disabled={currentPage>=pageCount} className="px-3 py-1.5 border rounded disabled:opacity-40">Próxima</button></div>
        </div>
      </div>
    </div>
  );
};
