import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ScanBarcode,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/products", label: "Products", icon: Package },
  { path: "/add-product", label: "Add Product", icon: PlusCircle },
  { path: "/scanner", label: "Scanner", icon: ScanBarcode },
];

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 h-14 bg-white border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary-600" />
          <span className="font-semibold text-base text-primary-700">
            SmartTrolley
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-surface-hover"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/15"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-border
          flex flex-col transition-transform duration-200
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-border">
          <ShoppingCart className="w-5 h-5 text-primary-600" />
          <div>
            <h1 className="font-semibold text-base text-text-primary leading-tight">
              SmartTrolley
            </h1>
            <p className="text-[11px] text-text-muted">Inventory Manager</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
            Menu
          </p>
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium
                transition-colors duration-150
                ${
                  isActive(path)
                    ? "bg-primary-50 text-primary-700"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                }
              `}
            >
              <Icon className={`w-4 h-4 ${isActive(path) ? "text-primary-600" : "text-text-muted"}`} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-border">
          <div className="px-3 py-2">
            <p className="text-[11px] text-text-muted">
              Smart Trolley v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
