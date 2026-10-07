import { Sequelize, DataTypes, Op } from 'sequelize';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import type { Product, StockMovement, Transfer, Invoice, StagedInvoice } from '../types';

const here = path.dirname(fileURLToPath(import.meta.url));
export const databasePath = process.env.DATABASE_PATH || path.resolve(here, '../../data/box.sqlite');
export const sequelize = new Sequelize({ dialect: 'sqlite', storage: databasePath, logging: false });

const ProductModel = sequelize.define('Product', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false }, sku: { type: DataTypes.STRING, allowNull: false, unique: true }, sourceCode: DataTypes.STRING,
  category: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Geral' }, stock: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'un' }, minStock: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  maxStock: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }, costPrice: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  salePrice: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }, image: { type: DataTypes.TEXT, allowNull: true }, supplier: { type: DataTypes.STRING, allowNull: true },
  invoiceNumber: { type: DataTypes.STRING, allowNull: true }, ncm: { type: DataTypes.STRING, allowNull: true }, icms: { type: DataTypes.STRING, allowNull: true }, cfop: { type: DataTypes.STRING, allowNull: true },
});
const MovementModel = sequelize.define('StockMovement', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true }, productId: { type: DataTypes.UUID, allowNull: true }, timestamp: DataTypes.STRING, time: DataTypes.STRING,
  productName: DataTypes.STRING, sku: DataTypes.STRING, origin: DataTypes.STRING, destination: DataTypes.STRING, operationType: DataTypes.STRING,
  quantity: DataTypes.FLOAT, unit: DataTypes.STRING, responsibleName: DataTypes.STRING, responsibleAvatar: DataTypes.STRING, branch: DataTypes.STRING,
  invoiceNumber: DataTypes.STRING, unitCost: DataTypes.FLOAT, unitSalePrice: DataTypes.FLOAT, sourceBalance: DataTypes.FLOAT,
  sourceCostValue: DataTypes.FLOAT, sourceSaleValue: DataTypes.FLOAT, sourceRow: DataTypes.INTEGER, importSourceKey: DataTypes.STRING,
});
const TransferModel = sequelize.define('Transfer', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true }, code: DataTypes.STRING, description: DataTypes.STRING, productName: DataTypes.STRING,
  quantity: DataTypes.FLOAT, originBranch: DataTypes.STRING, destinationBranch: DataTypes.STRING, status: DataTypes.STRING, progressPercent: DataTypes.INTEGER,
  eta: DataTypes.STRING, trackingCode: DataTypes.STRING, driver: DataTypes.STRING, plate: DataTypes.STRING,
});
const InvoiceModel = sequelize.define('Invoice', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true }, number: DataTypes.STRING, series: DataTypes.STRING, type: DataTypes.STRING,
  docType: DataTypes.STRING, partyName: DataTypes.STRING, taxId: DataTypes.STRING, date: DataTypes.STRING, amount: DataTypes.FLOAT,
  status: DataTypes.STRING, accessKey: DataTypes.STRING, xmlAvailable: DataTypes.BOOLEAN, cancellationReason: DataTypes.STRING, xml: DataTypes.TEXT,
  importSourceKey: DataTypes.STRING,
});
const StagedModel = sequelize.define('StagedInvoice', { id: { type: DataTypes.INTEGER, primaryKey: true }, payload: { type: DataTypes.TEXT, allowNull: false } });
const ProductImageModel = sequelize.define('ProductImage', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true }, productId: { type: DataTypes.UUID, allowNull: false },
  sourceRow: DataTypes.INTEGER, sourceKey: { type: DataTypes.STRING, unique: true }, isPrimary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  mimeType: { type: DataTypes.STRING, allowNull: false }, data: { type: DataTypes.BLOB('long'), allowNull: false },
});
const InventorySnapshotModel = sequelize.define('InventorySnapshot', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true }, date: { type: DataTypes.STRING, allowNull: false },
  costValue: { type: DataTypes.FLOAT, allowNull: false }, saleValue: { type: DataTypes.FLOAT, allowNull: false }, itemCount: { type: DataTypes.FLOAT, allowNull: false },
  sourceKey: { type: DataTypes.STRING, unique: true },
});

const plain = <T>(model: any): T => model.get({ plain: true }) as T;
export const db = {
  async init() {
    await sequelize.authenticate();
    await sequelize.sync();
    const queryInterface = sequelize.getQueryInterface();
    const imageColumns = await queryInterface.describeTable('ProductImages');
    if (!imageColumns.id) {
      const [legacyImages] = await sequelize.query('SELECT productId, mimeType, data FROM ProductImages');
      await queryInterface.dropTable('ProductImages');
      await ProductImageModel.sync();
      if (Array.isArray(legacyImages) && legacyImages.length) {
        await ProductImageModel.bulkCreate((legacyImages as any[]).map((image, index) => ({
          id: randomUUID(), productId: image.productId, sourceRow: index, sourceKey: `MIGRATED:${image.productId}`,
          isPrimary: true, mimeType: image.mimeType, data: image.data,
        })));
      }
    }
    const productColumns = await queryInterface.describeTable('Products');
    if (!productColumns.sourceCode) await queryInterface.addColumn('Products', 'sourceCode', { type: DataTypes.STRING, allowNull: true });
    const movementColumns = await queryInterface.describeTable('StockMovements');
    for (const [name, definition] of Object.entries({ invoiceNumber: DataTypes.STRING, unitCost: DataTypes.FLOAT, unitSalePrice: DataTypes.FLOAT, sourceBalance: DataTypes.FLOAT, sourceCostValue: DataTypes.FLOAT, sourceSaleValue: DataTypes.FLOAT, sourceRow: DataTypes.INTEGER, importSourceKey: DataTypes.STRING })) {
      if (!movementColumns[name]) await queryInterface.addColumn('StockMovements', name, { type: definition, allowNull: true });
    }
    const invoiceColumns = await queryInterface.describeTable('Invoices');
    if (!invoiceColumns.importSourceKey) await queryInterface.addColumn('Invoices', 'importSourceKey', { type: DataTypes.STRING, allowNull: true });
    for (const [table, column, indexName] of [
      ['StockMovements', 'importSourceKey', 'stock_movements_import_source_key_unique'],
      ['Invoices', 'importSourceKey', 'invoices_import_source_key_unique'],
    ] as const) {
      try { await queryInterface.addIndex(table, [column], { unique: true, name: indexName }); } catch { /* Index already exists. */ }
    }
  },
  async getProducts(filters: { search?: string; category?: string; status?: string } = {}): Promise<Product[]> {
    const where: any = {};
    if (filters.search) where[Op.or] = ['name', 'sku', 'sourceCode', 'category', 'supplier'].map(field => ({ [field]: { [Op.like]: `%${filters.search}%` } }));
    if (filters.category && filters.category !== 'all') where.category = filters.category;
    const rows = await ProductModel.findAll({ where, order: [['createdAt', 'DESC']] });
    return rows.map(row => { const p: any = plain<Product>(row); p.status = p.stock <= 0 ? 'out' : p.maxStock > 0 && p.stock > p.maxStock ? 'high' : p.stock <= p.minStock ? 'low' : 'ok'; p.icon='inventory_2'; p.iconBg='bg-blue-50'; p.iconColor='text-primary'; return p; }).filter(p => !filters.status || filters.status === 'all' || p.status === filters.status);
  },
  async getProductById(id: string) { const row = await ProductModel.findByPk(id); return row ? plain<Product>(row) : undefined; },
  async getProductImage(id: string) { const row = await ProductImageModel.findOne({ where: { productId: id }, order: [['isPrimary','DESC'],['sourceRow','DESC']] }); return row ? { mimeType: row.getDataValue('mimeType') as string, data: row.getDataValue('data') as Buffer } : null; },
  async addProduct(data: any) { const row=await ProductModel.create(data); const product:any=plain<Product>(row); product.status=product.stock<=0?'out':product.maxStock>0&&product.stock>product.maxStock?'high':product.stock<=product.minStock?'low':'ok'; product.icon='inventory_2'; product.iconBg='bg-blue-50'; product.iconColor='text-primary'; return product; },
  async updateProduct(id: string, data: any) { const row = await ProductModel.findByPk(id); if (!row) return null; await row.update(data); return (await this.getProducts()).find(p => p.id === id) || null; },
  async adjustProductStock(productId: string, newStock: number, reason: string, observation: string) {
    return sequelize.transaction(async transaction => {
      const row = await ProductModel.findByPk(productId, { transaction }); if (!row) return null;
      const p: any = plain<Product>(row); const diff = newStock - p.stock; await row.update({ stock: newStock }, { transaction });
      const now = new Date(); const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const movement = await MovementModel.create({ productId, timestamp: now.toLocaleString('pt-BR'), time, productName: p.name, sku: p.sku, origin: observation || 'Ajuste de estoque', destination: 'Estoque', operationType: reason === 'avaria' ? 'Ajuste Avaria' : 'Ajuste Inventário', quantity: diff, unit: p.unit, responsibleName: 'Operador', responsibleAvatar: '', branch: 'matriz' }, { transaction });
      p.stock=newStock; p.status=newStock<=0?'out':p.maxStock>0&&newStock>p.maxStock?'high':newStock<=p.minStock?'low':'ok';
      return { product: p as Product, movement: plain<StockMovement>(movement) };
    });
  },
  async getMovements(branch?: string): Promise<StockMovement[]> { const rows = await MovementModel.findAll({ where: branch && branch !== 'all' ? { branch } : {}, order: [['createdAt','DESC']] }); return rows.map(r => plain<StockMovement>(r)); },
  async addMovement(data: any) { return plain<StockMovement>(await MovementModel.create(data)); },
  async getTransfers(): Promise<Transfer[]> { return (await TransferModel.findAll({ order:[['createdAt','DESC']] })).map(r => plain<Transfer>(r)); },
  async addTransfer(data: any) { return plain<Transfer>(await TransferModel.create(data)); },
  async completeTransfer(id: string) { const row=await TransferModel.findByPk(id); if(!row)return null; await row.update({status:'Concluído',progressPercent:100}); return plain<Transfer>(row); },
  async getInvoices(): Promise<Invoice[]> { return (await InvoiceModel.findAll({ order:[['createdAt','DESC']] })).map(r => { const invoice:any=plain<Invoice>(r); delete invoice.xml; return invoice; }); },
  async getInvoice(id: string): Promise<Invoice|undefined> { const row=await InvoiceModel.findByPk(id); if(!row)return undefined; const invoice:any=plain<Invoice>(row); invoice.xmlContent=(row as any).getDataValue('xml')||undefined; return invoice; },
  async addInvoice(data: any) { return plain<Invoice>(await InvoiceModel.create(data)); },
  async getStagedInvoice(): Promise<StagedInvoice|null> { const row=await StagedModel.findByPk(1); return row ? JSON.parse((row as any).payload) : null; },
  async getInventorySnapshots() { return (await InventorySnapshotModel.findAll({ order: [['date', 'ASC']] })).map(row => row.get({ plain: true })); },
  async importInventoryBundle(bundle: { products: any[]; movements: any[]; invoices: any[]; snapshots: any[]; images: { productId: string; mimeType: string; data: Buffer }[] }) {
    return sequelize.transaction(async transaction => {
      await ProductModel.bulkCreate(bundle.products, { transaction, updateOnDuplicate: ['name','sourceCode','category','stock','unit','minStock','maxStock','costPrice','salePrice','supplier','invoiceNumber','image','updatedAt'] });
      await ProductImageModel.bulkCreate(bundle.images, { transaction, updateOnDuplicate: ['mimeType','data','updatedAt'] });
      await MovementModel.bulkCreate(bundle.movements, { transaction, updateOnDuplicate: ['productId','timestamp','time','productName','sku','origin','destination','operationType','quantity','unit','responsibleName','responsibleAvatar','branch','invoiceNumber','unitCost','unitSalePrice','sourceBalance','sourceCostValue','sourceSaleValue','sourceRow','updatedAt'] });
      await InvoiceModel.bulkCreate(bundle.invoices, { transaction, updateOnDuplicate: ['number','series','type','docType','partyName','taxId','date','amount','status','accessKey','xmlAvailable','importSourceKey','updatedAt'] });
      await InventorySnapshotModel.bulkCreate(bundle.snapshots, { transaction, ignoreDuplicates: true });
    });
  },
  async setStagedInvoice(value: StagedInvoice|null) { if(value) { value.items=await Promise.all(value.items.map(async item=>{const code=item.skuMatch?.trim(); if(!code)return {...item,status:'unlinked'}; const match=await ProductModel.findOne({where:{sku:code}}); return {...item,status:match?'linked':'unlinked'};})); await StagedModel.upsert({id:1,payload:JSON.stringify(value)}); } else await StagedModel.destroy({where:{id:1}}); return value; },
  async linkStagedItemSku(itemId: string, sku: string) { const staged=await this.getStagedInvoice(); if(!staged)return null; staged.items=staged.items.map(i=>i.id===itemId?{...i,status:'linked',skuMatch:sku}:i); await this.setStagedInvoice(staged); return staged; },
  async confirmXmlEntry(staged: StagedInvoice) {
    return sequelize.transaction(async transaction => {
      const now=new Date(); const when=now.toLocaleString('pt-BR'); const time=now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
      let latestMovement: StockMovement|null = null;
      for(const item of staged.items) {
        const product= item.skuMatch ? await ProductModel.findOne({where:{sku:item.skuMatch},transaction}) : null;
        if(!product) throw new Error(`Vincule o SKU do item "${item.name}" antes de confirmar.`);
        const p:any=plain<Product>(product); await product.update({stock:p.stock+item.quantity,costPrice:item.unitPrice,supplier:staged.supplierName,invoiceNumber:staged.invoiceNumber},{transaction});
        const movement=await MovementModel.create({productId:p.id,timestamp:when,time,productName:p.name,sku:p.sku,origin:staged.supplierName,destination:'Estoque',operationType:'Entrada Fornecedor',quantity:item.quantity,unit:item.unit,responsibleName:'Operador',responsibleAvatar:'',branch:'matriz'},{transaction}); latestMovement=plain<StockMovement>(movement);
      }
      const invoice=await InvoiceModel.create({number:staged.invoiceNumber,series:'1',type:'Entrada',docType:'NF-e',partyName:staged.supplierName,taxId:staged.supplierCnpj,date:when,amount:staged.totalAmount,status:'Importada',accessKey:staged.accessKey,xmlAvailable:Boolean(staged.xmlContent),xml:staged.xmlContent||null},{transaction});
      await StagedModel.destroy({where:{id:1},transaction});
      return {invoice:plain<Invoice>(invoice),movement:latestMovement};
    });
  },
};
