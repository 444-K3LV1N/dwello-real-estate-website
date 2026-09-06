import { Router } from 'express'
import { stats } from '../controllers/dashboardController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()
router.get('/stats', authenticate, authorize('AGENT', 'ADMIN'), stats)
export default router
