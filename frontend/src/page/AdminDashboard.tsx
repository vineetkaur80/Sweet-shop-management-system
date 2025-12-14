import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminStats, getSweets, deleteSweet } from "../api/sweets";
import type { Sweet } from "../types";

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Array<{
    _id: string;
    user?: { username: string };
    totalAmount: number;
    createdAt: string;
  }>;
  lowStockItems: Array<{
    _id: string;
    name: string;
    quantity: number;
  }>;
}

// --- AbSweets Icons ---
const Icons = {
  Home: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Box: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  Plus: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Chart: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 18V6" />
    </svg>
  ),
  Search: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Edit: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  ),
  Trash: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  ),
};

// ==========================================
// 1. OVERVIEW TAB (Stats & Ledger)
// ==========================================
const OverviewTab = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading)
    return <div className="p-8 text-center italic">Opening the books...</div>;
  if (!stats)
    return (
      <div className="p-8 text-center text-red-500">Error loading data.</div>
    );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Revenue",
            val: `$${stats.totalRevenue.toFixed(2)}`,
            color: "border-[#2A9D8F] shadow-[#2A9D8F]",
            icon: "💰",
          },
          {
            label: "Total Orders",
            val: stats.totalOrders,
            color: "border-[#E76F51] shadow-[#E76F51]",
            icon: "📦",
          },
          {
            label: "Products",
            val: stats.totalProducts,
            color: "border-[#E9C46A] shadow-[#E9C46A]",
            icon: "🧁",
          },
          {
            label: "Customers",
            val: stats.totalCustomers,
            color: "border-[#2C241B] shadow-gray-400",
            icon: "👥",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`bg-white p-5 rounded-xl border-2 border-[#2C241B] ${item.color} shadow-[4px_4px_0px_0px] relative overflow-hidden group hover:-translate-y-1 transition-transform`}
          >
            <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">
              {item.label}
            </p>
            <h2 className="text-3xl font-black text-[#2C241B]">{item.val}</h2>
            <span className="absolute top-2 right-2 text-2xl opacity-20">
              {item.icon}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Ledger */}
        <div className="lg:col-span-2 bg-white rounded-xl border-2 border-[#2C241B] shadow-[6px_6px_0px_0px_#2C241B] flex flex-col">
          <div className="p-4 border-b-2 border-[#2C241B] bg-[#FEFBEA] flex justify-between items-center">
            <h3 className="font-serif font-black text-xl italic">
              Recent Transactions
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#2C241B] text-[#FEFBEA] font-serif italic">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-dashed divide-[#2C241B]/10">
                {stats.recentOrders.length === 0 ? (
                  <tr className="p-4">
                    <td colSpan={4} className="p-4 text-center opacity-50">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map(
                    (order: AdminStats["recentOrders"][number]) => (
                      <tr
                        key={order._id}
                        className="hover:bg-[#FEFBEA] transition-colors"
                      >
                        <td className="p-4 font-bold">
                          {order.user?.username || "Guest"}
                        </td>
                        <td className="p-4 font-mono font-bold text-[#E76F51]">
                          ${order.totalAmount}
                        </td>
                        <td className="p-4 text-xs font-bold text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span className="border border-[#2A9D8F] text-[#2A9D8F] px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            Paid
                          </span>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-[#FFF8F0] rounded-xl border-2 border-[#2C241B] shadow-[4px_4px_0px_0px_#E76F51] flex flex-col">
          <div className="p-4 border-b-2 border-[#2C241B] bg-[#E76F51] text-white">
            <h3 className="font-bold">⚠️ Pantry Low Stock</h3>
          </div>
          <ul className="flex-grow p-0">
            {stats.lowStockItems.length === 0 ? (
              <li className="p-4 text-[#2A9D8F] font-bold text-center">
                Everything is stocked!
              </li>
            ) : (
              stats.lowStockItems.map(
                (item: AdminStats["lowStockItems"][number]) => (
                  <li
                    key={item._id}
                    className="p-3 border-b border-[#2C241B]/10 flex justify-between items-center hover:bg-white/50"
                  >
                    <span className="font-bold text-sm text-[#2C241B]">
                      {item.name}
                    </span>
                    <span className="font-black text-[#E76F51] text-sm">
                      {item.quantity} left
                    </span>
                  </li>
                )
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. INVENTORY TAB (Full Logic Integration)
// ==========================================
const InventoryTab = ({ onNavigateToAdd }: { onNavigateToAdd: () => void }) => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getSweets();
    setSweets(res.data);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this item from the pantry?")) {
      await deleteSweet(id);
      fetchData();
    }
  };

  const filteredSweets = sweets.filter(
    (sweet) =>
      sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sweet.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search the pantry..."
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#2C241B] rounded-full font-bold placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#2A9D8F]/20 focus:border-[#2A9D8F] transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2C241B]">
            <Icons.Search />
          </span>
        </div>
        <button
          onClick={onNavigateToAdd}
          className="flex items-center gap-2 px-5 py-3 bg-[#E76F51] text-white border-2 border-[#2C241B] rounded-xl font-bold shadow-[4px_4px_0px_0px_#2C241B] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all whitespace-nowrap"
        >
          <Icons.Plus /> Add Item
        </button>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border-2 border-[#2C241B] shadow-[6px_6px_0px_0px_#2C241B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-[#2C241B] text-[#FEFBEA]">
              <tr>
                <th className="px-6 py-4 font-serif italic text-lg tracking-wide font-normal">
                  Product
                </th>
                <th className="px-6 py-4 font-serif italic text-lg tracking-wide font-normal">
                  Category
                </th>
                <th className="px-6 py-4 font-serif italic text-lg tracking-wide font-normal">
                  Price
                </th>
                <th className="px-6 py-4 font-serif italic text-lg tracking-wide font-normal">
                  Status
                </th>
                <th className="px-6 py-4 font-serif italic text-lg tracking-wide font-normal text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-dashed divide-[#2C241B]/10">
              {filteredSweets.map((sweet) => (
                <tr
                  key={sweet._id}
                  className="hover:bg-[#FFF8F1] transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="text-base font-black text-[#2C241B]">
                      {sweet.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block border border-[#2C241B] bg-[#FEFBEA] text-[#2C241B] px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#ccc]">
                      {sweet.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-lg text-[#E76F51]">
                      ${sweet.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {sweet.quantity === 0 ? (
                      <span className="text-red-500 font-black text-xs uppercase tracking-wide">
                        Out of Stock
                      </span>
                    ) : sweet.quantity < 10 ? (
                      <span className="text-[#E9C46A] font-black text-xs uppercase tracking-wide">
                        Low Stock ({sweet.quantity})
                      </span>
                    ) : (
                      <span className="text-[#2A9D8F] font-black text-xs uppercase tracking-wide">
                        In Stock ({sweet.quantity})
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/edit/${sweet._id}`)}
                        className="p-2 bg-[#E9C46A] text-[#2C241B] rounded border-2 border-[#2C241B] hover:shadow-[2px_2px_0px_0px_#2C241B] transition-all"
                        title="Edit"
                      >
                        <Icons.Edit />
                      </button>
                      <button
                        onClick={() => handleDelete(sweet._id)}
                        className="p-2 bg-[#FFCDD2] text-red-800 rounded border-2 border-[#2C241B] hover:bg-red-400 hover:text-white hover:shadow-[2px_2px_0px_0px_#2C241B] transition-all"
                        title="Delete"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSweets.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center opacity-50">
                    The pantry is empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN DASHBOARD PARENT
// ==========================================
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "add">(
    "overview"
  );
  const navigate = useNavigate();

  const navItems = [
    { id: "overview", label: "Overview", icon: <Icons.Chart /> },
    { id: "inventory", label: "Inventory", icon: <Icons.Box /> },
    { id: "add", label: "Add Product", icon: <Icons.Plus /> },
  ];

  return (
    <div className="min-h-screen bg-[#FEFBEA] text-[#2C241B] font-sans flex flex-col md:flex-row">
      {/* --- SIDEBAR --- */}
      <aside className="w-full md:w-64 bg-[#2C241B] text-[#FEFBEA] flex flex-col border-r-4 border-[#E76F51] shrink-0">
        <div
          className="p-6 border-b border-[#FEFBEA]/20 flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="bg-[#E76F51] w-10 h-10 flex items-center justify-center rounded border-2 border-[#FEFBEA]">
            <span className="text-xl">⚙️</span>
          </div>
          <div>
            <h1 className="text-xl font-serif font-black italic tracking-wide">
              Admin<span className="text-[#E76F51]">Panel</span>
            </h1>
            <p className="text-[10px] uppercase opacity-70 tracking-widest">
              Back Office
            </p>
          </div>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                setActiveTab(item.id as "overview" | "inventory" | "add")
              }
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all duration-200 border-2
                    ${
                      activeTab === item.id
                        ? "bg-[#FEFBEA] text-[#2C241B] border-[#FEFBEA] shadow-[4px_4px_0px_0px_#E76F51] translate-x-1"
                        : "bg-transparent text-[#FEFBEA] border-transparent hover:bg-[#FEFBEA]/10 hover:border-[#FEFBEA]/20"
                    }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-[#FEFBEA]/20">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 hover:text-[#E76F51] transition"
          >
            <Icons.Home /> Back to Shop
          </button>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <main className="flex-grow p-6 md:p-10 h-screen overflow-y-auto">
        {/* Dynamic Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between md:items-end border-b-2 border-[#2C241B] pb-4 border-dashed gap-4">
          <div>
            <h2 className="text-4xl font-serif font-black capitalize">
              {activeTab}
            </h2>
            <p className="text-gray-500 font-bold mt-1">
              {activeTab === "overview" && "Today's bakery stats and ledger."}
              {activeTab === "inventory" &&
                "Manage stocks, prices and removal."}
              {activeTab === "add" && "Create a new delicious treat."}
            </p>
          </div>
          <div className="text-sm font-bold bg-[#E9C46A] px-3 py-1 rounded border-2 border-[#2C241B] shadow-[2px_2px_0px_0px_#2C241B] self-start md:self-end">
            {new Date().toLocaleDateString()}
          </div>
        </header>

        {/* Content Switcher */}
        <div className="max-w-6xl mx-auto pb-10">
          {activeTab === "overview" && <OverviewTab />}

          {activeTab === "inventory" && (
            <InventoryTab onNavigateToAdd={() => setActiveTab("add")} />
          )}

          {activeTab === "add" && (
            <div className="bg-white p-8 rounded-xl border-2 border-[#2C241B] shadow-[6px_6px_0px_0px_#2C241B] max-w-2xl text-center">
              <h3 className="text-xl font-bold mb-4">Add New Item</h3>
              <p className="text-gray-400 mb-6 italic">
                Ready to introduce a new treat to the world?
              </p>
              <button
                onClick={() => navigate("/admin/add")}
                className="bg-[#2A9D8F] text-white px-8 py-3 rounded border-2 border-[#2C241B] font-bold shadow-[4px_4px_0px_0px_#2C241B] hover:shadow-none hover:translate-y-[2px] transition-all"
              >
                Go to Recipe Form
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
