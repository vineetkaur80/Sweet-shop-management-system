import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getSweets } from "../api/sweets";
import type { Sweet } from "../types";

// --- AbSweets Icon Set ---
const Icons = {
  Cart: () => (
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
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  Search: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Trend: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Mail: () => (
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
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  User: () => (
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();

  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = sweets;
    if (category !== "All") {
      result = result.filter((s) => s.category === category);
    }
    if (searchTerm) {
      result = result.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredSweets(result);
    console.log("filteredSweets updated", result);
  }, [category, searchTerm, sweets]);

  const fetchData = async () => {
    try {
      const res = await getSweets();
      setSweets(res.data);
      const uniqueCats = [
        "All",
        ...new Set(res.data.map((s: Sweet) => s.category)),
      ];
      setCategories(uniqueCats as string[]);
    } catch (error) {
      console.error("Error fetching sweets");
    }
  };

  // --- Wrapper to enforce login before Adding to Cart ---
  const handleAddToCart = (sweet: Sweet) => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(sweet);
  };

  return (
    <div className="min-h-screen bg-[#FEFBEA] text-[#2C241B] font-sans flex flex-col">
      {/* --- Navbar --- */}
      <nav className="sticky top-0 z-50 bg-[#FEFBEA] border-b-2 border-[#2C241B]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-row justify-between items-center gap-4">
          {/* Brand */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="bg-[#E76F51] text-[#FEFBEA] w-10 h-10 flex items-center justify-center rounded-lg border-2 border-[#2C241B] shadow-[3px_3px_0px_0px_#2C241B] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
              <span className="text-xl">🍭</span>
            </div>
            <h1 className="text-2xl font-serif font-black tracking-tighter italic hidden sm:block">
              Ab<span className="text-[#E76F51]">Sweets</span>
            </h1>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={() => navigate("/cart")}
              className="relative bg-[#2A9D8F] text-white px-4 py-1.5 rounded-lg border-2 border-[#2C241B] font-bold shadow-[3px_3px_0px_0px_#2C241B] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center gap-2 text-sm"
            >
              <Icons.Cart />
              <span className="hidden sm:inline">Cart</span>
              {user && cart.length > 0 && (
                <span className="absolute -top-3 -right-3 bg-[#E76F51] text-white text-[10px] font-bold w-5 h-5 rounded-full border-2 border-[#2C241B] flex items-center justify-center z-10">
                  {cart.reduce((acc, item) => acc + item.cartQty, 0)}
                </span>
              )}
            </button>

            {/* --- AUTHENTICATION LOGIC START --- */}
            {user ? (
              // IF LOGGED IN
              <>
                {/* Admin Button (Only if role is admin) */}
                {user.role === "admin" && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="bg-[#E9C46A] text-[#2C241B] px-4 py-1.5 rounded-lg border-2 border-[#2C241B] font-bold shadow-[3px_3px_0px_0px_#2C241B] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all text-sm flex items-center gap-2"
                  >
                    <Icons.User /> Admin
                  </button>
                )}

                {/* Logout Button (For both Admin & Customer) */}
                <button
                  onClick={logout}
                  className="font-bold text-sm underline decoration-2 decoration-[#E76F51] hover:text-[#E76F51] ml-2"
                >
                  Logout
                </button>
              </>
            ) : (
              // IF NOT LOGGED IN (Guest)
              <button
                onClick={() => navigate("/login")}
                className="bg-[#E76F51] text-white px-5 py-1.5 rounded-lg border-2 border-[#2C241B] font-bold shadow-[3px_3px_0px_0px_#2C241B] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all text-sm hover:bg-[#D65F41]"
              >
                Login
              </button>
            )}
            {/* --- AUTHENTICATION LOGIC END --- */}
          </div>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-grow w-full">
        {/* --- Hero Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-[#E76F51] text-[#FEFBEA] rounded-2xl border-2 border-[#2C241B] p-10 shadow-[6px_6px_0px_0px_#2C241B] relative overflow-hidden flex flex-col justify-center">
            <span className="bg-[#E9C46A] text-[#2C241B] px-3 py-1 text-xs font-black uppercase tracking-widest border-2 border-[#2C241B] w-max mb-4 rotate-1">
              Fresh from the oven
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-black leading-none drop-shadow-[3px_3px_0px_rgba(44,36,27,0.4)] mb-4">
              BAKED WITH <br />{" "}
              <span className="text-[#2A9D8F] text-stroke-cream">
                PURE LOVE
              </span>
            </h2>
            <p className="font-medium max-w-sm text-sm md:text-base">
              Handcrafted daily using 1980s original recipes.
            </p>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-[#2A9D8F] rounded-full border-4 border-[#2C241B] flex items-center justify-center">
              <span className="text-6xl -rotate-12">🍩</span>
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="flex-1 bg-white border-2 border-[#2C241B] rounded-xl p-4 shadow-[4px_4px_0px_0px_#2C241B] flex flex-col">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                <Icons.Trend /> Trending
              </h3>
              <div className="flex items-end justify-between h-20 gap-2 mt-auto px-2 border-b-2 border-[#2C241B] border-dashed">
                <div className="w-1/4 bg-[#E9C46A] h-[60%] border-x-2 border-t-2 border-[#2C241B] rounded-t-sm"></div>
                <div className="w-1/4 bg-[#E76F51] h-[85%] border-x-2 border-t-2 border-[#2C241B] rounded-t-sm"></div>
                <div className="w-1/4 bg-[#2A9D8F] h-[40%] border-x-2 border-t-2 border-[#2C241B] rounded-t-sm"></div>
                <div className="w-1/4 bg-[#FEFBEA] h-[75%] border-2 border-[#2C241B] border-b-0 rounded-t-sm"></div>
              </div>
            </div>

            <div className="flex-1 bg-[#2A9D8F] border-2 border-[#2C241B] rounded-xl p-4 shadow-[4px_4px_0px_0px_#2C241B] flex items-center justify-between text-white">
              <div>
                <p className="text-xs font-bold opacity-90 uppercase tracking-widest">
                  New Arrivals
                </p>
                <p className="text-3xl font-black font-serif">+12</p>
              </div>
              <div className="text-3xl">🍪</div>
            </div>
          </div>
        </div>

        {/* --- Search & Filter Toolbar --- */}
        <div className="bg-[#E9C46A] border-2 border-[#2C241B] rounded-xl p-4 mb-8 shadow-[4px_4px_0px_0px_#2C241B] flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Find your favorite treat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-[#2C241B] bg-white text-[#2C241B] placeholder:text-gray-400 font-bold focus:outline-none focus:ring-4 focus:ring-[#E76F51]/30 transition-all shadow-inner"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2C241B]">
              <Icons.Search />
            </span>
          </div>

          <div className="hidden md:block w-0.5 h-10 bg-[#2C241B] opacity-20 mx-2"></div>

          <div className="w-full overflow-x-auto no-scrollbar">
            <div className="flex gap-2 items-center">
              <span className="font-serif font-bold italic mr-2 whitespace-nowrap">
                Filter by:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full font-bold border-2 border-[#2C241B] transition-all text-sm
                            ${
                              category === cat
                                ? "bg-[#2C241B] text-[#E9C46A] shadow-[2px_2px_0px_0px_#888]"
                                : "bg-white text-[#2C241B] hover:bg-[#FEFBEA] hover:shadow-[2px_2px_0px_0px_#2C241B]"
                            }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- Grid --- */}
        {filteredSweets.length === 0 ? (
          <div className="border-4 border-dashed border-[#2C241B]/20 rounded-2xl p-12 text-center bg-white/50">
            <div className="text-4xl mb-2">🤔</div>
            <h3 className="text-xl font-bold text-gray-500">
              No goodies found!
            </h3>
            <p className="text-gray-400">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSweets.map((sweet) => (
              <div
                key={sweet._id}
                className="group relative bg-white border-2 border-[#2C241B] rounded-xl overflow-hidden hover:shadow-[8px_8px_0px_0px_#2C241B] hover:-translate-y-1 transition-all duration-200"
              >
                <div className="absolute top-2 right-2 z-10">
                  {sweet.quantity < 5 && sweet.quantity > 0 && (
                    <span className="bg-[#E76F51] text-white text-[10px] font-bold px-2 py-1 border border-[#2C241B] shadow-[2px_2px_0px_0px_#2C241B]">
                      Low Stock
                    </span>
                  )}
                </div>

                <div className="h-48 overflow-hidden relative">
                  <img
                    src={
                      sweet.image ||
                      "https://placehold.co/400x300?text=No+Image"
                    }
                    alt={sweet.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x300?text=Error";
                    }}
                  />
                  {/* Category Badge on top of image */}
                  <span className="absolute top-2 right-2 bg-white/90 text-blue-800 text-xs font-bold px-2 py-1 rounded shadow">
                    {sweet.category}
                  </span>
                </div>

                <div className="p-4">
                  <span className="text-[10px] font-black uppercase text-[#2A9D8F] tracking-widest">
                    {sweet.category}
                  </span>
                  <h3 className="text-xl font-bold leading-tight mb-2 text-[#2C241B]">
                    {sweet.name}
                  </h3>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t-2 border-dashed border-[#2C241B]/20">
                    <span className="text-lg font-black">${sweet.price}</span>
                    <button
                      onClick={() => handleAddToCart(sweet)} // Uses wrapper function to check login
                      disabled={sweet.quantity === 0}
                      className={`w-8 h-8 flex items-center justify-center rounded border-2 border-[#2C241B] transition-all
                        ${
                          sweet.quantity > 0
                            ? "bg-[#E9C46A] hover:bg-[#2C241B] hover:text-[#E9C46A]"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- Footer --- */}
      <footer className="bg-[#2C241B] text-[#FEFBEA] mt-16 border-t-4 border-[#E76F51]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-serif font-black italic">
                Ab<span className="text-[#E76F51]">Sweets</span>
              </h2>
              <p className="text-sm opacity-80 max-w-xs leading-relaxed">
                Bringing back the golden age of confectionery. Est. 2025.
                Handcrafted with love and plenty of sugar.
              </p>
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-[#2C241B] border border-[#FEFBEA] rounded hover:bg-[#E76F51] hover:border-[#E76F51] transition-colors cursor-pointer flex items-center justify-center"
                  >
                    <span className="text-xs">★</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-[#E9C46A] uppercase tracking-widest text-sm">
                Join the Club
              </h4>
              <p className="text-xs opacity-80">
                Get sweet deals delivered to your inbox.
              </p>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Icons.Mail />
                  <input
                    type="email"
                    placeholder="you@email.com"
                    className="w-full bg-[#FEFBEA] text-[#2C241B] pl-10 pr-3 py-2 rounded border-2 border-transparent focus:border-[#E76F51] focus:outline-none placeholder:text-gray-500 font-bold text-sm"
                  />
                </div>
                <button className="bg-[#E76F51] text-white px-4 py-2 rounded font-bold border-2 border-[#E76F51] hover:bg-[#2C241B] hover:text-[#E76F51] transition-colors">
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-bold text-[#2A9D8F] mb-3">Shop</h4>
                <ul className="space-y-2 opacity-80">
                  <li className="hover:text-[#E9C46A] cursor-pointer hover:translate-x-1 transition-transform">
                    Donuts
                  </li>
                  <li className="hover:text-[#E9C46A] cursor-pointer hover:translate-x-1 transition-transform">
                    Cookies
                  </li>
                  <li className="hover:text-[#E9C46A] cursor-pointer hover:translate-x-1 transition-transform">
                    Candies
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#2A9D8F] mb-3">Help</h4>
                <ul className="space-y-2 opacity-80">
                  <li className="hover:text-[#E9C46A] cursor-pointer hover:translate-x-1 transition-transform">
                    Shipping
                  </li>
                  <li className="hover:text-[#E9C46A] cursor-pointer hover:translate-x-1 transition-transform">
                    Returns
                  </li>
                  <li className="hover:text-[#E9C46A] cursor-pointer hover:translate-x-1 transition-transform">
                    FAQ
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-[#FEFBEA]/20 text-center text-xs opacity-50 uppercase tracking-widest">
            © 2025 AbSweets Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
