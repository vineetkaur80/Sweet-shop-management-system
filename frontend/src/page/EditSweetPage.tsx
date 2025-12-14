import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSweetById, updateSweet } from "../api/sweets";

export interface EditSweetFormData {
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
}
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
  Save: () => (
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
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  Clipboard: () => (
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
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  ),
};

const EditSweetPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm<EditSweetFormData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getSweetById(id)
        .then((res) => {
          setValue("name", res.data.name);
          setValue("category", res.data.category);
          setValue("price", res.data.price);
          setValue("quantity", res.data.quantity);
          setValue("image", res.data.image); // <--- Add this li
          setLoading(false);
        })
        .catch(() => {
          alert("Product not found");
          navigate("/admin");
        });
    }
  }, [id, setValue, navigate]);

  const onSubmit = async (data: EditSweetFormData) => {
    if (!id) return;
    try {
      await updateSweet(id, data);
      navigate("/admin"); // Redirect back to dashboard
    } catch (error) {
      alert("Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FEFBEA] flex flex-col items-center justify-center text-[#2C241B]">
        <div className="w-16 h-16 border-4 border-[#2C241B] border-t-[#2A9D8F] rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-serif font-bold">Finding the Recipe...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFBEA] text-[#2C241B] font-sans flex items-center justify-center p-6">
      {/* --- Main Card Container --- */}
      <div className="max-w-2xl w-full bg-white rounded-3xl border-2 border-[#2C241B] shadow-[8px_8px_0px_0px_#2C241B] overflow-hidden">
        {/* Decorative Header Strip - Teal for "Edit" */}
        <div className="bg-[#2A9D8F] h-4 w-full border-b-2 border-[#2C241B]"></div>

        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between md:items-start mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[#2A9D8F] p-2 rounded-lg border-2 border-[#2C241B] shadow-[2px_2px_0px_0px_#2C241B]">
                  <Icons.Clipboard />
                </div>
                <h2 className="text-3xl font-serif font-black italic">
                  Update Inventory
                </h2>
              </div>
              <p className="text-sm font-bold text-gray-500 max-w-sm">
                Edit the details for this sweet treat.
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <span className="text-[10px] font-bold bg-[#FEFBEA] border border-[#2C241B] px-2 py-1 rounded">
                ID: {id}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Product Name */}
            <div>
              <label
                className="block text-xs font-black uppercase tracking-widest mb-2 ml-1"
                htmlFor="name"
              >
                Sweet Name
              </label>
              <input
                id="name"
                {...register("name", { required: true })}
                className="w-full bg-[#FEFBEA] border-2 border-[#2C241B] rounded-xl px-4 py-3 font-bold placeholder:text-gray-400 focus:outline-none focus:border-[#E76F51] focus:shadow-[4px_4px_0px_0px_#E76F51] transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label
                className="block text-xs font-black uppercase tracking-widest mb-2 ml-1"
                htmlFor="category"
              >
                Category
              </label>
              <input
                id="category"
                {...register("category", { required: true })}
                className="w-full bg-[#FEFBEA] border-2 border-[#2C241B] rounded-xl px-4 py-3 font-bold placeholder:text-gray-400 focus:outline-none focus:border-[#2A9D8F] focus:shadow-[4px_4px_0px_0px_#2A9D8F] transition-all"
              />
            </div>

            {/* Grid for Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label
                  className="block text-xs font-black uppercase tracking-widest mb-2 ml-1"
                  htmlFor="price"
                >
                  Price ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">
                    $
                  </span>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    className="w-full pl-8 bg-[#FEFBEA] border-2 border-[#2C241B] rounded-xl px-4 py-3 font-bold placeholder:text-gray-400 focus:outline-none focus:border-[#E9C46A] focus:shadow-[4px_4px_0px_0px_#E9C46A] transition-all"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label
                  className="block text-xs font-black uppercase tracking-widest mb-2 ml-1"
                  htmlFor="quantity"
                >
                  Stock Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  {...register("quantity", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="w-full bg-[#FEFBEA] border-2 border-[#2C241B] rounded-xl px-4 py-3 font-bold placeholder:text-gray-400 focus:outline-none focus:border-[#E9C46A] focus:shadow-[4px_4px_0px_0px_#E9C46A] transition-all"
                />
                <p className="text-[10px] text-gray-500 font-bold mt-1 ml-1">
                  Increase this number to restock.
                </p>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t-2 border-dashed border-[#2C241B]/20">
              <Link
                to="/admin"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-transparent text-gray-500 font-bold hover:text-[#E76F51] hover:bg-[#FEFBEA] transition-colors"
              >
                <Icons.Back /> Back
              </Link>
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#E76F51] text-white px-8 py-3 rounded-xl border-2 border-[#2C241B] font-bold shadow-[4px_4px_0px_0px_#2C241B] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
              >
                <Icons.Save /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSweetPage;
