const buildSearch = (term, fields) => term ? { $or: fields.map(field => ({ [field]: { $regex: term, $options: 'i' } })) } : {}
const createResourceController = (Model, populate = '', searchFields = ['name'], refModel = null, refSearchFields = ['name']) => ({
  create: async (req, res) => { try { const data = await Model.create(req.body); res.status(201).json({ success: true, message: 'Created successfully', data }) } catch (e) { res.status(400).json({ success: false, message: e.message }) } },
  list: async (req, res) => {
    try {
      const page = Math.max(Number(req.query.page) || 1, 1),
        limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
      const orConditions = req.query.search ? searchFields.map(field => ({ [field]: { $regex: req.query.search, $options: 'i' } })) : [];
      if (req.query.search && refModel && populate) {
        const refMatches = await refModel.find(buildSearch(req.query.search, refSearchFields)).select('_id').lean();
        if (refMatches.length) orConditions.push({ [populate]: { $in: refMatches.map(r => r._id) } });
      }
      const filter = { isDeleted: req.query.deleted === 'true' ? true : { $ne: true }, ...(orConditions.length ? { $or: orConditions } : {}) };
      if (req.query.status) filter.status = req.query.status;
      if (req.query.service) filter.service = req.query.service;
      if (req.query.serviceNot) filter.service = { $ne: req.query.serviceNot };
      if (req.query.from || req.query.to) {
        filter.createdAt = {};
        if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
        if (req.query.to) filter.createdAt.$lte = new Date(req.query.to + 'T23:59:59.999Z');
      }
      const query = Model.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
      if (populate) query.populate(populate);
      const [data, total] = await Promise.all([query, Model.countDocuments(filter)]);
      res.json({ success: true, count: data.length, total, page, pages: Math.ceil(total / limit), data });
    } catch (e) { res.status(500).json({ success: false, message: e.message }) }
  },
  get: async (req,res)=>{try{const data=await Model.findById(req.params.id);if(!data)return res.status(404).json({success:false,message:'Record not found'});res.json({success:true,data})}catch(e){res.status(400).json({success:false,message:e.message})}},
  update: async(req,res)=>{try{const data=await Model.findOneAndUpdate({_id:req.params.id,isDeleted:{$ne:true}},req.body,{new:true,runValidators:true});if(!data)return res.status(404).json({success:false,message:'Active record not found'});res.json({success:true,message:'Updated successfully',data})}catch(e){res.status(400).json({success:false,message:e.message})}},
  remove: async(req,res)=>{try{const data=await Model.findOneAndUpdate({_id:req.params.id,isDeleted:{$ne:true}},{isDeleted:true,deletedAt:new Date()},{new:true});if(!data)return res.status(404).json({success:false,message:'Active record not found'});res.json({success:true,message:'Moved to trash',data})}catch(e){res.status(400).json({success:false,message:e.message})}},
  restore: async(req,res)=>{try{const data=await Model.findOneAndUpdate({_id:req.params.id,isDeleted:true},{isDeleted:false,deletedAt:null},{new:true});if(!data)return res.status(404).json({success:false,message:'Deleted record not found'});res.json({success:true,message:'Restored successfully',data})}catch(e){res.status(400).json({success:false,message:e.message})}},
})
module.exports = createResourceController
