import { useState } from "react";
import BarcodeDisplay from "./BarcodeDisplay";
import toast from "react-hot-toast";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Pencil, Trash2, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

export default function ProductCard({ product, onEdit, index = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isLowStock = product.quantity <= 5;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "products", product.id));
      toast.success(`"${product.name}" deleted`);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div
      className="bg-white rounded-xl border border-border hover:border-primary-200
                 hover:shadow-sm transition-all duration-200 overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Low stock badge */}
      {isLowStock && (
        <div className="px-4 py-1.5 bg-amber-50 border-b border-amber-100 flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 text-amber-500" />
          <span className="text-[11px] font-medium text-amber-600">Low Stock</span>
        </div>
      )}

      <div className="p-4">
        {/* Name & ID */}
        <div className="mb-3">
          <h3 className="font-medium text-sm text-text-primary leading-tight">
            {product.name}
          </h3>
          <p className="text-[11px] text-text-muted mt-0.5 font-mono">
            #{product.barcode}
          </p>
        </div>

        {/* Price & Qty */}
        <div className="flex items-center gap-4 mb-3">
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wide">Price</p>
            <p className="text-base font-semibold text-text-primary">
              ₹{product.price?.toFixed(2)}
            </p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wide">Qty</p>
            <p className={`text-base font-semibold ${isLowStock ? "text-amber-500" : "text-text-primary"}`}>
              {product.quantity}
            </p>
          </div>
        </div>

        {/* Toggle barcode */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 py-1.5 rounded-md
                     text-xs text-text-muted hover:text-primary-600 hover:bg-primary-50/50
                     transition-colors duration-150"
        >
          {expanded ? "Hide" : "Show"} Barcode
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {/* Barcode */}
        <div
          className={`overflow-hidden transition-all duration-200 ${
            expanded ? "max-h-36 opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          <BarcodeDisplay value={product.barcode} height={45} width={1.2} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex border-t border-border">
        <button
          onClick={() => onEdit?.(product)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2
                     text-xs font-medium text-text-muted hover:text-primary-600 hover:bg-primary-50/50
                     transition-colors duration-150"
        >
          <Pencil className="w-3 h-3" />
          Edit
        </button>

        <div className="w-px bg-border" />

        {showConfirm ? (
          <div className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50/50">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs font-medium text-red-500 hover:underline disabled:opacity-50"
            >
              {deleting ? "..." : "Yes, delete"}
            </button>
            <span className="text-border">|</span>
            <button
              onClick={() => setShowConfirm(false)}
              className="text-xs text-text-muted hover:text-text-primary"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2
                       text-xs font-medium text-text-muted hover:text-red-500 hover:bg-red-50/50
                       transition-colors duration-150"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
