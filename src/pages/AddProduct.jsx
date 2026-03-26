import { useLocation, useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { ArrowLeft } from "lucide-react";

export default function AddProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const editProduct = location.state?.editProduct || null;

  const handleComplete = () => {
    navigate("/products");
  };

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg border border-border hover:bg-surface-hover transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4 text-text-secondary" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            {editProduct ? "Edit Product" : "Add Product"}
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            {editProduct
              ? `Editing "${editProduct.name}"`
              : "Fill in the details to add a new product"}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-border p-5">
        <ProductForm editProduct={editProduct} onComplete={handleComplete} />
      </div>
    </div>
  );
}
