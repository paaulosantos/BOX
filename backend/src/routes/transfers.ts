import { Router } from 'express';
import { db } from '../data/store';
const router=Router();
router.get('/',async(_req,res)=>{try{res.json({success:true,data:await db.getTransfers()});}catch(e:any){res.status(500).json({success:false,message:e.message});}});
router.post('/',async(req,res)=>{try{const {productName,quantity,originBranch,destinationBranch}=req.body;if(!productName||!Number(quantity)||!originBranch||!destinationBranch)return res.status(400).json({success:false,message:'Produto, quantidade, origem e destino são obrigatórios'});const code=`TRF-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;const t=await db.addTransfer({...req.body,code,description:req.body.description||`${quantity}x ${productName}`,status:'Em Separação',progressPercent:0,trackingCode:'',eta:req.body.eta||''});res.status(201).json({success:true,data:t});}catch(e:any){res.status(500).json({success:false,message:e.message});}});
router.patch('/:id/complete',async(req,res)=>{try{const t=await db.completeTransfer(req.params.id);if(!t)return res.status(404).json({success:false,message:'Transferência não encontrada'});res.json({success:true,data:t});}catch(e:any){res.status(500).json({success:false,message:e.message});}});
export default router;
