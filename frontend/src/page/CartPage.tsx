import { useState } from "react";
import { useCart } from "../context/CartContext";
import { purchaseSweet } from "../api/sweets";
import { useNavigate } from "react-router-dom";

// --- AbSweets Icons ---
const Icons = {
  Back: () => (
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
  Trash: () => (
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  ),
  Bag: () => (
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
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  Check: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

const CartPage = () => {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const promises = cart.map((item) =>
        purchaseSweet(item._id, item.cartQty)
      );
      await Promise.all(promises);

      alert("Purchase successful! Enjoy your treats.");
      clearCart();
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Some items could not be purchased. Check stock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFBEA] text-[#2C241B] font-sans flex flex-col">
      {/* --- Navbar (Simplified for Cart) --- */}
      <nav className="sticky top-0 z-50 bg-[#FEFBEA] border-b-2 border-[#2C241B]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="bg-[#E76F51] text-[#FEFBEA] w-10 h-10 flex items-center justify-center rounded-lg border-2 border-[#2C241B] shadow-[3px_3px_0px_0px_#2C241B] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
              <span className="text-xl">🍭</span>
            </div>
            <h1 className="text-2xl font-serif font-black tracking-tighter italic">
              AbSweets<span className="text-[#E76F51]">Sweets</span>
            </h1>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm font-bold hover:text-[#E76F51] underline decoration-2 decoration-[#E9C46A]"
          >
            <Icons.Back /> Continue Shopping
          </button>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="max-w-6xl mx-auto px-6 py-12 w-full flex-grow">
        <div className="mb-8 flex items-end gap-4 border-b-2 border-dashed border-[#2C241B]/20 pb-4">
          <h2 className="text-4xl font-serif font-black">Your Bag</h2>
          <span className="text-xl font-bold text-[#2A9D8F] mb-1">
            {cart.length} {cart.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {cart.length === 0 ? (
          /* --- Empty State --- */
          <div className="flex flex-col items-center justify-center py-20 border-4 border-dashed border-[#2C241B]/20 rounded-3xl bg-white/50">
            <div className="w-24 h-24 bg-[#E9C46A] rounded-full flex items-center justify-center border-4 border-[#2C241B] mb-6">
              <Icons.Bag />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-2">
              It's empty in here!
            </h2>
            <p className="text-gray-600 mb-8 font-medium">
              Looks like you haven't picked any treats yet.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-[#2A9D8F] text-white px-8 py-3 rounded-xl border-2 border-[#2C241B] font-bold shadow-[4px_4px_0px_0px_#2C241B] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#2C241B] transition-all"
            >
              Go to Bakery
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* --- Cart Items List --- */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center gap-6 bg-white border-2 border-[#2C241B] p-6 rounded-2xl shadow-[4px_4px_0px_0px_#2C241B] relative"
                >
                  {/* Image Placeholder */}
                  <img
                    src={item.image || "https://placehold.co/100"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded bg-gray-100"
                  />

                  {/* Details */}
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-xl font-serif font-bold mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                      Delicious Treat
                    </p>
                    <div className="inline-block bg-[#FEFBEA] px-3 py-1 rounded border border-[#2C241B] text-sm font-bold">
                      Qty: {item.cartQty}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex flex-row sm:flex-col items-center gap-4 sm:gap-2">
                    <span className="text-xl font-black text-[#2C241B]">
                      ${(item.price * item.cartQty).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 font-bold text-sm flex items-center gap-1 hover:underline"
                    >
                      <Icons.Trash /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* --- Order Summary (Receipt Style) --- */}
            <div className="lg:col-span-1">
              <div className="bg-[#E9C46A] border-2 border-[#2C241B] p-8 rounded-xl shadow-[8px_8px_0px_0px_#2C241B] sticky top-24 relative overflow-hidden">
                {/* Receipt Texture Top */}
                <div className="absolute top-0 left-0 w-full h-4 bg-[url('https://www.transparenttextures.com/patterns/zigzag.png')] opacity-20"></div>

                <h3 className="text-2xl font-serif font-black mb-6 border-b-2 border-[#2C241B] border-dashed pb-4 text-center">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6 font-medium text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Taxes (Est.)</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="text-[#2A9D8F] font-bold">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t-2 border-[#2C241B] pt-4 mb-8">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-black">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className={`w-full py-4 rounded-xl border-2 border-[#2C241B] font-bold text-lg shadow-[4px_4px_0px_0px_#2C241B] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all flex justify-center items-center gap-2
                        ${
                          loading
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                            : "bg-[#E76F51] text-white hover:bg-[#D65F41]"
                        }`}
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      Checkout <Icons.Check />
                    </>
                  )}
                </button>

                {/* Decorative hole punch */}
                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#FEFBEA] rounded-full border-2 border-[#2C241B]"></div>
                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#FEFBEA] rounded-full border-2 border-[#2C241B]"></div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- Footer --- */}
      <footer className="bg-[#2C241B] text-[#FEFBEA] border-t-4 border-[#E76F51]">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="font-serif italic text-xl mb-2">
            Thank you for shopping with AbSweets!
          </p>
          <p className="text-xs opacity-50 uppercase tracking-widest">
            © 2025 AbSweets Inc.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CartPage;
