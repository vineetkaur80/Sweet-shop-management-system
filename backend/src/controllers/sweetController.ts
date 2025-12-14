import { Request, Response } from 'express';
import Sweet from '../models/Sweet';
import Order from '../models/Order'; // <--- Import Order
import User from '../models/User';   // <--- Import User (for counting customers)

// --- PUBLIC ROUTES ---


// List all
export const getAllSweets = async (req: Request, res: Response) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Single by ID
export const getSweetById = async (req: Request, res: Response) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ error: 'Sweet not found' });
    res.json(sweet);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Search & Filter
export const searchSweets = async (req: Request, res: Response) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;
    const filter: any = {};

    if (q) filter.name = { $regex: q as string, $options: "i" };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(filter);
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// --- ADMIN CRUD ---

// Create
export const createSweet = async (req: Request, res: Response) => {
  try {
    const sweet = new Sweet(req.body);
    await sweet.save();
    res.status(201).json(sweet);
  } catch (error) {
    res.status(500).json({ error: 'Error creating sweet' });
  }
};

// Update
export const updateSweet = async (req: Request, res: Response) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sweet) return res.status(404).json({ error: 'Sweet not found' });
    res.json(sweet);
  } catch (error) {
    res.status(500).json({ error: 'Error updating sweet' });
  }
};

// Delete
export const deleteSweet = async (req: Request, res: Response) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    if (!sweet) return res.status(404).json({ error: 'Sweet not found' });
    res.json({ message: 'Sweet deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting sweet' });
  }
};

// Restock
export const restockSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const addQty = quantity || 1;

    const sweet = await Sweet.findById(id);
    if (!sweet) return res.status(404).json({ error: 'Sweet not found' });

    sweet.quantity += addQty;
    await sweet.save();

    res.json({ message: 'Restock successful', quantity: sweet.quantity });
  } catch (error) {
    res.status(500).json({ error: 'Restock failed' });
  }
};

// --- TRANSACTIONS ---

// Purchase Sweet (Updated to Record Order)
export const purchaseSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const buyQty = quantity || 1;

    // 1. Check Stock
    const sweet = await Sweet.findById(id);
    if (!sweet) return res.status(404).json({ error: 'Sweet not found' });

    if (sweet.quantity < buyQty) {
      return res.status(400).json({ error: `Insufficient stock. Only ${sweet.quantity} left.` });
    }

    // 2. Reduce Stock
    sweet.quantity -= buyQty;
    await sweet.save();

    // 3. Create Order Record
    const userId = (req as any).user?.id; // Assumes authMiddleware attaches user
    if (userId) {
      await Order.create({
        user: userId,
        items: [{
          sweet: sweet._id,
          name: sweet.name,
          quantity: buyQty,
          price: sweet.price
        }],
        totalAmount: sweet.price * buyQty
      });
    }

    res.json({ message: 'Purchase successful', quantity: sweet.quantity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Purchase failed' });
  }
};

// --- ANALYTICS (NEW) ---

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // 1. Basic Counts
    const totalProducts = await Sweet.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();

    // 2. Financials (Revenue)
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    // 3. Low Stock Items (<= 5)
    const lowStockItems = await Sweet.find({ quantity: { $lte: 5 } }).limit(5);

    // 4. Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'username');

    // 5. Orders Today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: startOfDay } });

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      avgOrderValue,
      todayOrders,
      lowStockItems,
      recentOrders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching stats' });
  }
};