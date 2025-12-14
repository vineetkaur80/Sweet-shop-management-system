import { Request, Response } from 'express';
import Sweet from '../models/Sweet';
import Order from '../models/Order';
import User from '../models/User';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // 1. Basic Counts
    const totalProducts = await Sweet.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();

    // 2. Financials
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    // 3. Low Stock Items (e.g., less than 5 items)
    const lowStockItems = await Sweet.find({ quantity: { $lte: 5 } }).limit(5);

    // 4. Recent Orders (Last 5)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'username');

    // 5. Today's Stats
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
    res.status(500).json({ error: 'Error fetching admin stats' });
  }
};