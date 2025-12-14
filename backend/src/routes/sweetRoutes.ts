import { Router } from 'express';
import { 
  getAllSweets, 
  getSweetById,
  searchSweets, 
  createSweet, 
  updateSweet, 
  deleteSweet,
  purchaseSweet, 
  restockSweet,
  getDashboardStats // <--- Import the new function
} from '../controllers/sweetController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public Routes
router.get('/', getAllSweets);
router.get('/search', searchSweets);
router.get('/:id', getSweetById);

// Protected User Routes
router.post('/:id/purchase', verifyToken, purchaseSweet);

// Protected Admin Routes
// Note: Place /admin/stats BEFORE /:id to avoid "admin" being treated as an ID
router.get('/admin/stats', verifyToken, isAdmin, getDashboardStats); // <--- New Route
router.post('/', verifyToken, isAdmin, createSweet);
router.put('/:id', verifyToken, isAdmin, updateSweet);
router.delete('/:id', verifyToken, isAdmin, deleteSweet);
router.post('/:id/restock', verifyToken, isAdmin, restockSweet);

// Admin Dashboard Stats
router.get('/admin/stats', verifyToken, isAdmin, getDashboardStats);
export default router;