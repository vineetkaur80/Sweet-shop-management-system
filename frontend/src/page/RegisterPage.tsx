import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

// --- AbSweets Icons ---
const Icons = {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Lock: () => (
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
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Star: () => (
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

export interface RegisterFormData {
  username: string;
  password: string;
}

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      // Optional: Add a success flash message logic here if you have one
      alert("Welcome to the club! Please login.");
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Username might be taken.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFBEA] text-[#2C241B] font-sans flex items-center justify-center p-4">
      {/* --- Register Card --- */}
      <div className="w-full max-w-md bg-white border-2 border-[#2C241B] rounded-3xl shadow-[8px_8px_0px_0px_#2C241B] overflow-hidden relative">
        {/* Decorative Top Strip (Mustard Yellow for 'New') */}
        <div className="h-3 w-full border-b-2 border-[#2C241B] bg-[#E9C46A]"></div>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full border-2 border-[#2C241B] shadow-[2px_2px_0px_0px_#2C241B] mb-4 bg-[#E9C46A] text-[#2C241B]">
              <span className="text-3xl">✨</span>
            </div>
            <h1 className="text-3xl font-serif font-black italic tracking-tight">
              Join the{" "}
              <span className="text-[#E9C46A] text-stroke-thin">Club</span>
            </h1>
            <p className="text-gray-500 font-bold text-sm mt-1">
              Create your sweet account today.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-100 border-2 border-red-500 text-red-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <div>
              <label
                className="block text-xs font-black uppercase tracking-widest mb-1 ml-1"
                htmlFor="username"
              >
                Choose Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  {...register("username", { required: true })}
                  className="w-full bg-[#FEFBEA] border-2 border-[#2C241B] rounded-xl pl-10 pr-4 py-3 font-bold placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#E9C46A]/50 focus:border-[#E9C46A] transition-all"
                  placeholder="Type a username..."
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icons.User />
                </span>
              </div>
              {errors.username && (
                <span className="text-[#E76F51] text-xs font-bold mt-1 ml-1 block">
                  Username is required
                </span>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs font-black uppercase tracking-widest mb-1 ml-1"
                htmlFor="password"
              >
                Create Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  {...register("password", { required: true })}
                  className="w-full bg-[#FEFBEA] border-2 border-[#2C241B] rounded-xl pl-10 pr-4 py-3 font-bold placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#E9C46A]/50 focus:border-[#E9C46A] transition-all"
                  placeholder="••••••••"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icons.Lock />
                </span>
              </div>
              {errors.password && (
                <span className="text-[#E76F51] text-xs font-bold mt-1 ml-1 block">
                  Password is required
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl border-2 border-[#2C241B] font-bold text-[#2C241B] bg-[#E9C46A] shadow-[4px_4px_0px_0px_#2C241B] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none hover:bg-[#D4B055] transition-all flex justify-center items-center gap-2 mt-6"
            >
              Register Now <Icons.Star />
            </button>
          </form>

          {/* Footer Divider & Link */}
          <div className="mt-8 pt-6 border-t-2 border-dashed border-[#2C241B]/10 text-center flex flex-col gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Already a member?
            </span>
            <Link
              to="/login"
              className="text-sm font-black text-[#2A9D8F] underline decoration-2 decoration-dashed underline-offset-4 hover:text-[#2C241B] transition-colors"
            >
              Login to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
