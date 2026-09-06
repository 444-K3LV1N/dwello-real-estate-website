import { Router } from 'express'
import { addFavorite, listFavorites, removeFavorite } from '../controllers/favoriteController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
router.use(authenticate)
router.get('/', listFavorites)
router.post('/:propertyId', addFavorite)
router.delete('/:propertyId', removeFavorite)
export default router
