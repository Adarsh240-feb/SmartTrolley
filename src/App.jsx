import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Scanner from "./pages/Scanner";

// ============================================================
// App Root Component
// Sets up routing, sidebar layout, and global toast notifications.
// The main content area is offset for the sidebar on larger screens.
// ============================================================

export default function App() {
  return (
    <BrowserRouter>
      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#0f172a",
            color: "#f8fafc",
            fontSize: "13px",
            fontWeight: "500",
            padding: "12px 16px",
          },
          success: {
            iconTheme: { primary: "#10b981", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />

      <div className="min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen">
          <div className="p-5 lg:p-6 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/scanner" element={<Scanner />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
