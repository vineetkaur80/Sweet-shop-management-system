import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Pages
import LoginPage from "./page/LoginPagee"; // Note: You might want to rename the file to LoginPage.tsx
import DashboardPage from "./page/DashboardPage";
import RegisterPage from "./page/RegisterPage";
import CartPage from "./page/CartPage";

// Admin Pages
import AdminDashboard from "./page/AdminDashboard";
// import InventoryPage from "./page/InventroyPage"; // Fixed spelling here
import AddSweetPage from "./page/AddSweetPage";
import EditSweetPage from "./page/EditSweetPage";

// --- Route Guards ---

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="p-10 text-center font-bold text-gray-500">
        Loading Session...
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // PrivateRoute handles the spinner
  return user?.role === "admin" ? children : <Navigate to="/dashboard" />;
};

// --- Main App ---

function App() {
  console.log(import.meta.env.VITE_API_BASE_URL);
  return (
    // <AuthProvider>
    <CartProvider>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User Protected */}
        <Route
          path="/dashboard"
          element={
            <DashboardPage />
            // <PrivateRoute>
            // </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />

        {/* Admin Protected Group */}
        {/* 1. Analytics Dashboard */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </PrivateRoute>
          }
        />

        {/* 2. Inventory List */}
        {/* <Route
            path="/admin/inventory"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <InventoryPage />
                </AdminRoute>
              </PrivateRoute>
            }
          /> */}

        {/* 3. Add Product */}
        <Route
          path="/admin/add"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AddSweetPage />
              </AdminRoute>
            </PrivateRoute>
          }
        />

        {/* 4. Edit Product */}
        <Route
          path="/admin/edit/:id"
          element={
            <PrivateRoute>
              <AdminRoute>
                <EditSweetPage />
              </AdminRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </CartProvider>
    // </AuthProvider>
  );
}

export default App;
