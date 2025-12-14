// import React from "react";
import { useForm } from "react-hook-form";
import { createSweet } from "../api/sweets";
import { useNavigate, Link } from "react-router-dom";

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
  Pen: () => (
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
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  ),
};

const AddSweetPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await createSweet(data);
      navigate("/admin"); // Redirect to Dashboard/Inventory
    } catch (error) {
      alert("Failed to add sweet");
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFBEA] text-[#2C241B] font-sans flex items-center justify-center p-6">
      {/* --- Main Card Container --- */}
      <div className="max-w-2xl w-full bg-white rounded-3xl border-2 border-[#2C241B] shadow-[8px_8px_0px_0px_#2C241B] overflow-hidden relative">
        {/* Decorative Header Strip */}
        <div className="bg-[#E76F51] h-4 w-full border-b-2 border-[#2C241B]"></div>

        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[#E9C46A] p-2 rounded-lg border-2 border-[#2C241B] shadow-[2px_2px_0px_0px_#2C241B]">
                  <Icons.Pen />
                </div>
                <h2 className="text-3xl font-serif font-black italic">
                  New Recipe
                </h2>
              </div>
              <p className="text-sm font-bold text-gray-500 max-w-sm">
                Add a new delicious item to the pantry inventory.
              </p>
            </div>
            <Link
              to="/admin"
              className="text-sm font-bold underline decoration-2 decoration-[#E76F51] hover:text-[#E76F51]"
            >
              Cancel & Exit
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Product Name */}
            <div>
              <label
                className="block text-xs font-black uppercase tracking-widest mb-2 ml-1"
                htmlFor="name"
              >
                Sweet Name <span className="text-[#E76F51]">*</span>
              </label>
              <input
                id="name"
                {...register("name", { required: true })}
                className="w-full bg-[#FEFBEA] border-2 border-[#2C241B] rounded-xl px-4 py-3 font-bold placeholder:text-gray-400 focus:outline-none focus:border-[#E76F51] focus:shadow-[4px_4px_0px_0px_#E76F51] transition-all"
                placeholder="e.g. Grandma's Apple Pie"
              />
              {errors.name && (
                <span className="text-[#E76F51] text-xs font-bold mt-1 block">
                  ⚠ Name is required
                </span>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                className="block text-xs font-black uppercase tracking-widest mb-2 ml-1"
                htmlFor="category"
              >
                Category <span className="text-[#E76F51]">*</span>
              </label>
              <input
                id="category"
                {...register("category", { required: true })}
                className="w-full bg-[#FEFBEA] border-2 border-[#2C241B] rounded-xl px-4 py-3 font-bold placeholder:text-gray-400 focus:outline-none focus:border-[#2A9D8F] focus:shadow-[4px_4px_0px_0px_#2A9D8F] transition-all"
                placeholder="e.g. Pastry, Chocolate, Donut"
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
                  Price ($) <span className="text-[#E76F51]">*</span>
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
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  {...register("image")}
                  placeholder="https://example.com/candy.jpg"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty for default image
                </p>
              </div>
              {/* Quantity */}
              <div>
                <label
                  className="block text-xs font-black uppercase tracking-widest mb-2 ml-1"
                  htmlFor="quantity"
                >
                  Initial Stock <span className="text-[#E76F51]">*</span>
                </label>
                <input
                  id="quantity"
                  type="number"
                  {...register("quantity", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="w-full bg-[#FEFBEA] border-2 border-[#2C241B] rounded-xl px-4 py-3 font-bold placeholder:text-gray-400 focus:outline-none focus:border-[#E9C46A] focus:shadow-[4px_4px_0px_0px_#E9C46A] transition-all"
                  placeholder="0"
                />
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
                className="flex items-center gap-2 bg-[#2A9D8F] text-white px-8 py-3 rounded-xl border-2 border-[#2C241B] font-bold shadow-[4px_4px_0px_0px_#2C241B] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
              >
                <Icons.Save /> Save to Pantry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSweetPage;
