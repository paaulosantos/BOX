import { Router } from 'express';
import { db } from '../data/store';

const router = Router();
router.get('/:id/image', async (req, res) => {
  try {
    const image = await db.getProductImage(req.params.id);
    if (!image) return res.sendStatus(404);
    res.setHeader('Content-Type', image.mimeType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(image.data);
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});
router.get('/', async (req, res) => { try { res.json({success:true,data:await db.getProducts({search:String(req.query.search||''),category:String(req.query.category||''),status:String(req.query.status||'')})}); } catch(e:any) { res.status(500).json({success:false,message:e.message}); } });
router.get('/:id', async (req,res) => { try { const product=await db.getProductById(req.params.id); if(!product)return res.status(404).json({success:false,message:'Produto não encontrado'}); res.json({success:true,data:product}); } catch(e:any){res.status(500).json({success:false,message:e.message});} });
router.post('/', async (req,res) => { try { const {name,sku}=req.body; if(!name?.trim()||!sku?.trim())return res.status(400).json({success:false,message:'Nome e código do produto são obrigatórios'}); const product=await db.addProduct({...req.body,name:name.trim(),sku:sku.trim().toUpperCase(),stock:Number(req.body.stock)||0,minStock:Number(req.body.minStock)||0,maxStock:Number(req.body.maxStock)||0,costPrice:Number(req.body.costPrice)||0,salePrice:Number(req.body.salePrice)||0}); res.status(201).json({success:true,data:product}); } catch(e:any){res.status(e.name==='SequelizeUniqueConstraintError'?409:500).json({success:false,message:e.name==='SequelizeUniqueConstraintError'?'Este código já está cadastrado.':e.message});} });
router.put('/:id', async (req,res) => { try { const p=await db.updateProduct(req.params.id,req.body); if(!p)return res.status(404).json({success:false,message:'Produto não encontrado'}); res.json({success:true,data:p}); }catch(e:any){res.status(500).json({success:false,message:e.message});} });
router.patch('/:id/stock', async (req,res) => { try { const result=await db.adjustProductStock(req.params.id,Number(req.body.newStock),req.body.reason||'',req.body.observation||''); if(!result)return res.status(404).json({success:false,message:'Produto não encontrado'}); res.json({success:true,data:result}); }catch(e:any){res.status(500).json({success:false,message:e.message});} });
router.patch('/:id/fiscal', async (req,res) => { try { const p=await db.updateProduct(req.params.id,{ncm:req.body.ncm,icms:req.body.icms,cfop:req.body.cfop}); if(!p)return res.status(404).json({success:false,message:'Produto não encontrado'}); res.json({success:true,data:p}); }catch(e:any){res.status(500).json({success:false,message:e.message});} });
export default router;
