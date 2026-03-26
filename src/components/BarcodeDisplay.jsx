import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

// ============================================================
// BarcodeDisplay Component
// Renders a scannable barcode image using JsBarcode library.
// Accepts a `value` prop (the barcode string) and renders it
// onto an SVG element.
// ============================================================

export default function BarcodeDisplay({ value, width = 1.5, height = 50 }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: "CODE128", // Universal barcode format
          width,
          height,
          displayValue: true,
          fontSize: 12,
          fontOptions: "600",
          font: "Inter",
          textMargin: 6,
          margin: 8,
          background: "transparent",
          lineColor: "#0f172a",
        });
      } catch {
        // If barcode generation fails, SVG will remain empty
        console.warn("Failed to generate barcode for value:", value);
      }
    }
  }, [value, width, height]);

  return (
    <div className="flex items-center justify-center p-2 bg-white rounded-lg">
      <svg ref={svgRef} className="max-w-full" />
    </div>
  );
}
