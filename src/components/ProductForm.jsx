import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import BarcodeDisplay from "./BarcodeDisplay";
import toast from "react-hot-toast";
import { Save, RotateCcw, Loader2 } from "lucide-react";

export default function ProductForm({ editProduct = null, onComplete }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [barcode, setBarcode] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditMode = Boolean(editProduct);

  useEffect(() => {
    if (editProduct) {
      setName(editProduct.name || "");
      setPrice(String(editProduct.price ?? ""));
      setQuantity(String(editProduct.quantity ?? ""));
      setBarcode(editProduct.barcode || "");
    } else {
      generateBarcode();
    }
  }, [editProduct]);

  // Generate a 12-digit numeric barcode from UUID
  const generateBarcode = () => {
    const uuid = uuidv4().replace(/-/g, "");
    const numericCode = uuid
      .slice(0, 12)
      .split("")
      .map((c) => c.charCodeAt(0) % 10)
      .join("");
    setBarcode(numericCode);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setQuantity("");
    generateBarcode();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Product name is required");
    if (!price || Number(price) <= 0) return toast.error("Enter a valid price");
    if (!quantity || Number(quantity) < 0) return toast.error("Enter a valid quantity");

    setSaving(true);

    try {
      const productData = {
        name: name.trim(),
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        barcode,
      };

      if (isEditMode) {
        const docRef = doc(db, "products", editProduct.id);
        await updateDoc(docRef, { ...productData, updatedAt: serverTimestamp() });
        toast.success("Product updated!");
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: serverTimestamp(),
        });
        toast.success("Product added!");
        resetForm();
      }

      onComplete?.();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save. Check Firebase connection.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Barcode Preview */}
      <div className="p-3 rounded-lg bg-zinc-50 border border-border">
        <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-2">
          Barcode Preview
        </p>
        <BarcodeDisplay value={barcode} height={55} />
        <div className="mt-2 flex items-center justify-between">
          <code className="text-xs font-mono text-text-secondary">
            {barcode}
          </code>
          {!isEditMode && (
            <button
              type="button"
              onClick={generateBarcode}
              className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Regenerate
            </button>
          )}
        </div>
      </div>

      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Product Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Amul Milk 500ml"
          className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm
                     placeholder:text-text-muted
                     focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                     transition-colors"
        />
      </div>

      {/* Price & Quantity */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Price (₹)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm
                       placeholder:text-text-muted
                       focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                       transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Quantity
          </label>
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm
                       placeholder:text-text-muted
                       focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                       transition-colors"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                   bg-primary-600 hover:bg-primary-700
                   text-white font-medium text-sm
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-150"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            {isEditMode ? "Update Product" : "Add Product"}
          </>
        )}
      </button>
    </form>
  );
}
