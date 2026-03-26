import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import StatsCard from "../components/StatsCard";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useNavigate } from "react-router-dom";
import {
  Package,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  PlusCircle,
} from "lucide-react";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore listener error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const lowStockCount = products.filter((p) => p.quantity <= 5).length;
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode?.includes(searchTerm)
  );

  const handleEdit = (product) => {
    navigate("/add-product", { state: { editProduct: product } });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Overview of your inventory
          </p>
        </div>
        <button
          onClick={() => navigate("/add-product")}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg
                     bg-primary-600 hover:bg-primary-700
                     text-white text-sm font-medium
                     transition-colors duration-150"
        >
          <PlusCircle className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          color="primary"
        />
        <StatsCard
          title="Inventory Value"
          value={`₹${totalValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="success"
        />
        <StatsCard
          title="Low Stock"
          value={lowStockCount}
          icon={AlertTriangle}
          color="warning"
        />
        <StatsCard
          title="Total Items"
          value={totalItems.toLocaleString()}
          icon={TrendingUp}
          color="accent"
        />
      </div>

      {/* Products */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-base font-semibold text-text-primary">Recent Products</h2>
          <SearchBar onSearch={setSearchTerm} />
        </div>

        {loading ? (
          <LoadingSkeleton count={8} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="w-8 h-8 text-text-muted mb-3" />
            <p className="text-sm text-text-secondary font-medium mb-0.5">No products found</p>
            <p className="text-xs text-text-muted">
              {searchTerm
                ? `No results for "${searchTerm}"`
                : "Add your first product to get started"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
