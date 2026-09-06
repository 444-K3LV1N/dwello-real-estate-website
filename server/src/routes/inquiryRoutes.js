import { Router } from 'express'
import {
  createInquiry,
  getInquiry,
  inquirySchema,
  listInquiries
} from '../controllers/inquiryController.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

router.post('/', authenticate, validate(inquirySchema), createInquiry)
router.get('/', authenticate, listInquiries)
router.get('/:id', authenticate, getInquiry)

export default router