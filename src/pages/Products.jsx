import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useNavigate } from "react-router-dom";
import { Package, PlusCircle, LayoutGrid, List } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
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

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode?.includes(searchTerm)
  );

  const handleEdit = (product) => {
    navigate("/add-product", { state: { editProduct: product } });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Products</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {products.length} product{products.length !== 1 && "s"} in inventory
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

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <SearchBar onSearch={setSearchTerm} />

        <div className="flex items-center bg-white border border-border rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === "grid"
                ? "bg-primary-50 text-primary-600"
                : "text-text-muted hover:text-text-primary"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === "table"
                ? "bg-primary-50 text-primary-600"
                : "text-text-muted hover:text-text-primary"
            }`}
            aria-label="Table view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton count={8} />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="w-8 h-8 text-text-muted mb-3" />
          <p className="text-sm text-text-secondary font-medium mb-0.5">No products found</p>
          <p className="text-xs text-text-muted">
            {searchTerm
              ? `No results for "${searchTerm}"`
              : "Your inventory is empty"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
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
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-zinc-50">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-text-muted">
                  Barcode
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-text-muted">
                  Name
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-text-muted">
                  Price
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-text-muted">
                  Qty
                </th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-zinc-50 transition-colors"
                >
                  <td className="px-4 py-2.5">
                    <code className="text-xs font-mono text-text-secondary">
                      {product.barcode}
                    </code>
                  </td>
                  <td className="px-4 py-2.5 font-medium text-text-primary">
                    {product.name}
                  </td>
                  <td className="px-4 py-2.5 text-text-primary">
                    ₹{product.price?.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`text-xs font-medium ${
                        product.quantity <= 5 ? "text-amber-500" : "text-text-primary"
                      }`}
                    >
                      {product.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
