import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import BarcodeDisplay from "../components/BarcodeDisplay";
import { ScanBarcode, Search, Loader2, XCircle } from "lucide-react";

export default function Scanner() {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [product, setProduct] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    setSearching(true);
    setProduct(null);
    setSearched(false);

    try {
      const q = query(
        collection(db, "products"),
        where("barcode", "==", barcodeInput.trim())
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setProduct({ id: doc.id, ...doc.data() });
      }
      setSearched(true);
    } catch (error) {
      console.error("Barcode lookup error:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleClear = () => {
    setBarcodeInput("");
    setProduct(null);
    setSearched(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <ScanBarcode className="w-8 h-8 text-primary-600 mx-auto mb-2" />
        <h1 className="text-xl font-bold text-text-primary">Barcode Scanner</h1>
        <p className="text-sm text-text-muted mt-0.5">
          Enter a barcode to look up product details
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleLookup} className="flex gap-2">
        <div className="relative flex-1">
          <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            placeholder="Enter barcode ID..."
            className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-border bg-white text-sm
                       placeholder:text-text-muted
                       focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                       transition-colors"
          />
          {barcodeInput && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2"
            >
              <XCircle className="w-4 h-4 text-text-muted hover:text-text-secondary" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={searching || !barcodeInput.trim()}
          className="px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700
                     text-white font-medium text-sm
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors flex items-center gap-1.5"
        >
          {searching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          Lookup
        </button>
      </form>

      {/* Result */}
      {searched && (
        <div className="animate-fade-in-up">
          {product ? (
            <div className="bg-white rounded-xl border border-border p-5 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-text-primary">{product.name}</h2>
                <p className="text-xs text-text-muted font-mono">#{product.barcode}</p>
              </div>

              <div className="flex gap-6">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wide">Price</p>
                  <p className="text-xl font-bold text-text-primary">₹{product.price?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wide">In Stock</p>
                  <p className={`text-xl font-bold ${product.quantity <= 5 ? "text-amber-500" : "text-text-primary"}`}>
                    {product.quantity}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 border border-border">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Barcode</p>
                <BarcodeDisplay value={product.barcode} height={55} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <XCircle className="w-8 h-8 text-red-400 mb-2" />
              <p className="text-sm text-text-primary font-medium">Product Not Found</p>
              <p className="text-xs text-text-muted mt-0.5">
                No product matches barcode "{barcodeInput}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
