import { Router } from 'express'
import { createProperty, deleteProperty, getProperty, listProperties, propertySchema, updateProperty } from '../controllers/propertyController.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()
router.get('/', listProperties)
router.get('/:id', getProperty)
router.post('/', authenticate, authorize('AGENT', 'ADMIN'), validate(propertySchema), createProperty)
router.put('/:id', authenticate, authorize('AGENT', 'ADMIN'), validate(propertySchema), updateProperty)
router.delete('/:id', authenticate, authorize('AGENT', 'ADMIN'), deleteProperty)
export default router
