import { Product, StockMovement, Transfer, Invoice, StagedInvoice } from '../types';

const API_BASE = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Erro HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  // Products
  async getProducts(params?: { search?: string; category?: string; status?: string }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await request<{ success: boolean; data: Product[] }>(`/products${qs}`);
    return res.data;
  },

  async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
    const res = await request<{ success: boolean; data: Product }>(`/products`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const res = await request<{success:boolean;data:Product}>(`/products/${id}`, {method:'PUT',body:JSON.stringify(data)});
    return res.data;
  },

  async adjustStock(
    productId: string,
    newStock: number,
    reason: string,
    observation: string
  ): Promise<{ product: Product; movement: StockMovement }> {
    const res = await request<{
      success: boolean;
      data: { product: Product; movement: StockMovement };
    }>(`/products/${productId}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ newStock, reason, observation }),
    });
    return res.data;
  },

  async updateFiscal(
    productId: string,
    ncm: string,
    icms: string,
    cfop: string
  ): Promise<Product> {
    const res = await request<{ success: boolean; data: Product }>(`/products/${productId}/fiscal`, {
      method: 'PATCH',
      body: JSON.stringify({ ncm, icms, cfop }),
    });
    return res.data;
  },

  // Movements
  async getMovements(branch?: string): Promise<StockMovement[]> {
    const qs = branch && branch !== 'all' ? `?branch=${branch}` : '';
    const res = await request<{ success: boolean; data: StockMovement[] }>(`/movements${qs}`);
    return res.data;
  },

  async createMovement(data: Omit<StockMovement, 'id' | 'timestamp' | 'time'>): Promise<StockMovement> {
    const res = await request<{ success: boolean; data: StockMovement }>(`/movements`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // Transfers
  async getTransfers(): Promise<Transfer[]> {
    const res = await request<{ success: boolean; data: Transfer[] }>(`/transfers`);
    return res.data;
  },

  async createTransfer(data: Omit<Transfer, 'id'>): Promise<Transfer> {
    const res = await request<{ success: boolean; data: Transfer }>(`/transfers`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async completeTransfer(transferId: string): Promise<Transfer> {
    const res = await request<{ success: boolean; data: Transfer }>(`/transfers/${transferId}/complete`, {
      method: 'PATCH',
    });
    return res.data;
  },

  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    const res = await request<{ success: boolean; data: Invoice[] }>(`/invoices`);
    return res.data;
  },

  async emitInvoice(data: Omit<Invoice, 'id'>): Promise<Invoice> {
    const res = await request<{ success: boolean; data: Invoice }>(`/invoices`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async getStagedInvoice(): Promise<StagedInvoice | null> {
    const res = await request<{ success: boolean; data: StagedInvoice | null }>(`/invoices/staged`);
    return res.data;
  },

  async stageInvoice(data: StagedInvoice): Promise<StagedInvoice> {
    const res = await request<{ success: boolean; data: StagedInvoice }>(`/invoices/staged`, { method: 'POST', body: JSON.stringify(data) });
    return res.data;
  },

  async linkStagedSku(itemId: string, sku: string): Promise<StagedInvoice> {
    const res = await request<{ success: boolean; data: StagedInvoice }>(`/invoices/staged/link-sku`, {
      method: 'POST',
      body: JSON.stringify({ itemId, sku }),
    });
    return res.data;
  },

  async confirmXmlEntry(staged?: StagedInvoice): Promise<{ invoice: Invoice; movement: StockMovement }> {
    const res = await request<{
      success: boolean;
      data: { invoice: Invoice; movement: StockMovement };
    }>(`/invoices/staged/confirm`, {
      method: 'POST',
      body: JSON.stringify({ staged }),
    });
    return res.data;
  },

  async consultKey(key: string): Promise<any> {
    const res = await request<{ success: boolean; data: any }>(`/invoices/consult-key`, {
      method: 'POST',
      body: JSON.stringify({ key }),
    });
    return res.data;
  },

  getXmlUrl(invoiceId: string): string {
    return `${API_BASE}/invoices/${invoiceId}/xml`;
  }
};
