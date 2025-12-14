import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSweets, deleteSweet } from "../api/sweets";
import type { Sweet } from "../types";

// --- AbSweets Icons ---
const Icons = {
  Back: () => (
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
  Plus: () => (
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
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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

const InventoryPage = () => {
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
    <div className="min-h-screen bg-[#FEFBEA] text-[#2C241B] font-sans p-6 md:p-10">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-black italic tracking-tight text-[#2C241B]">
            Pantry Inventory
          </h1>
          <p className="text-sm font-bold text-gray-500 mt-2 uppercase tracking-widest">
            Manage Stock & Pricing
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            to="/admin"
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[#2C241B] rounded-xl font-bold hover:bg-[#FEFBEA] hover:shadow-[4px_4px_0px_0px_#2C241B] transition-all"
          >
            <Icons.Back /> Analytics
          </Link>
          <Link
            to="/admin/add"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E76F51] text-white border-2 border-[#2C241B] rounded-xl font-bold shadow-[4px_4px_0px_0px_#2C241B] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <Icons.Plus /> Add Item
          </Link>
        </div>
      </div>

      {/* --- Search Bar --- */}
      <div className="mb-8 relative max-w-lg">
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

      {/* --- Ledger Table --- */}
      <div className="bg-white rounded-2xl border-2 border-[#2C241B] shadow-[8px_8px_0px_0px_#2C241B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-[#2C241B] text-[#FEFBEA]">
              <tr>
                <th className="px-6 py-4 font-serif italic text-lg tracking-wide font-normal">
                  Product Name
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
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="text-base font-black text-[#2C241B]">
                      {sweet.name}
                    </div>
                    <div className="text-[10px] font-mono text-gray-400">
                      ID: {sweet._id.slice(-6)}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className="inline-block border border-[#2C241B] bg-[#FEFBEA] text-[#2C241B] px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#ccc]">
                      {sweet.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-lg text-[#E76F51]">
                      ${sweet.price.toFixed(2)}
                    </span>
                  </td>

                  {/* Stock Status */}
                  <td className="px-6 py-4">
                    {sweet.quantity === 0 ? (
                      <span className="flex items-center gap-1 text-red-500 font-black text-xs uppercase tracking-wide">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>{" "}
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

                  {/* Actions */}
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
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center opacity-50">
                      <span className="text-4xl mb-2">🥨</span>
                      <p className="font-bold text-lg text-[#2C241B]">
                        The pantry is empty.
                      </p>
                      <p className="text-sm">
                        No items found matching your search.
                      </p>
                    </div>
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

export default InventoryPage;
