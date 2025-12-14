import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

interface LoginFormData {
  username: string;
  password: string;
}

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
  Arrow: () => (
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
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [role, setRole] = useState<"customer" | "admin">("customer");
  console.log("Current Role:", role);
  console.log("Errors:", errors);
  // Helper to pre-fill credentials based on role (Optional convenience)
  useEffect(() => {
    if (role === "admin") {
      setValue("username", "abhay@mail");
      setValue("password", "abhay");
    } else {
      setValue("username", "abhay_user@mail");
      setValue("password", "abhay123");
    }
  }, [role, setValue]);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      await login(data);
      // Redirect based on role logic
      if (data.username === "admin") {
        navigate("/admin");
      } else {
        navigate("/"); // Go to Dashboard
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFBEA] text-[#2C241B] font-sans flex items-center justify-center p-4">
      {/* --- Login Card --- */}
      <div className="w-full max-w-md bg-white border-2 border-[#2C241B] rounded-3xl shadow-[8px_8px_0px_0px_#2C241B] overflow-hidden relative">
        {/* Decorative Top Strip */}
        <div
          className={`h-3 w-full border-b-2 border-[#2C241B] ${
            role === "admin" ? "bg-[#2A9D8F]" : "bg-[#E76F51]"
          }`}
        ></div>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className={`w-16 h-16 mx-auto flex items-center justify-center rounded-full border-2 border-[#2C241B] shadow-[2px_2px_0px_0px_#2C241B] mb-4 text-3xl
                    ${
                      role === "admin"
                        ? "bg-[#2A9D8F] text-white"
                        : "bg-[#E76F51] text-white"
                    }`}
            >
              {role === "admin" ? "⚙️" : "🍩"}
            </div>
            <h1 className="text-3xl font-serif font-black italic tracking-tight">
              Welcome{" "}
              <span
                className={
                  role === "admin" ? "text-[#2A9D8F]" : "text-[#E76F51]"
                }
              >
                Back!
              </span>
            </h1>
            <p className="text-gray-500 font-bold text-sm mt-1">
              Please sign in to continue.
            </p>
          </div>

          {/* Role Toggle Switch */}
          <div className="flex bg-[#FEFBEA] p-1 rounded-xl border-2 border-[#2C241B] mb-6 relative">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`flex-1 py-2 rounded-lg text-sm font-black transition-all z-10
                    ${
                      role === "customer"
                        ? "bg-[#E76F51] text-white shadow-sm"
                        : "text-gray-400 hover:text-[#2C241B]"
                    }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-2 rounded-lg text-sm font-black transition-all z-10
                    ${
                      role === "admin"
                        ? "bg-[#2A9D8F] text-white shadow-sm"
                        : "text-gray-400 hover:text-[#2C241B]"
                    }`}
            >
              Admin
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-100 border-2 border-red-500 text-red-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1 ml-1">
                Username
              </label>
              <div className="relative">
                <input
                  {...register("username", { required: true })}
                  className="w-full bg-[#FEFBEA] border-2 border-[#2C241B] rounded-xl pl-10 pr-4 py-3 font-bold placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#E9C46A]/50 transition-all"
                  placeholder="Enter username"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icons.User />
                </span>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  {...register("password", { required: true })}
                  className="w-full bg-[#FEFBEA] border-2 border-[#2C241B] rounded-xl pl-10 pr-4 py-3 font-bold placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#E9C46A]/50 transition-all"
                  placeholder="••••••••"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icons.Lock />
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-xl border-2 border-[#2C241B] font-bold text-white shadow-[4px_4px_0px_0px_#2C241B] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all flex justify-center items-center gap-2 mt-6
                    ${
                      role === "admin"
                        ? "bg-[#2A9D8F] hover:bg-[#208377]"
                        : "bg-[#E76F51] hover:bg-[#D65F41]"
                    }`}
            >
              Sign In <Icons.Arrow />
            </button>
          </form>

          {/* --- Register Section (Added) --- */}
          <div className="mt-6 flex flex-col items-center gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              New to the shop?
            </span>
            <Link
              to="/register"
              className={`text-sm font-black underline decoration-2 decoration-dashed underline-offset-4 hover:decoration-solid transition-all
                ${
                  role === "admin"
                    ? "text-[#2A9D8F] decoration-[#2A9D8F]"
                    : "text-[#E76F51] decoration-[#E76F51]"
                }`}
            >
              Create an Account
            </Link>
          </div>

          {/* Divider */}
          <div className="my-4 border-t-2 border-dashed border-[#2C241B]/10 w-3/4 mx-auto"></div>

          {/* Guest Link */}
          <div className="text-center">
            <Link
              to="/"
              className="text-xs font-bold text-gray-400 hover:text-[#2C241B] transition-colors"
            >
              Skip & Continue as Guest →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
