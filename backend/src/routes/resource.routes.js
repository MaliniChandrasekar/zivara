const express = require('express')
const createResourceController = require('../controllers/resource.controller')
module.exports = (Model, populate, middleware = [], searchFields, refModel, refSearchFields) => {
  const router = express.Router(), controller = createResourceController(Model, populate, searchFields, refModel, refSearchFields)
  if (middleware.length) router.use(...middleware)
  router.route('/').get(controller.list).post(controller.create)
  router.patch('/:id/restore', controller.restore)
  router.route('/:id').get(controller.get).put(controller.update).patch(controller.update).delete(controller.remove)
  return router
}
