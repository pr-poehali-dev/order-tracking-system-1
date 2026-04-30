import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { exportToCSV, exportToJSON, exportToExcel } from "@/utils/export";

interface Props {
  data: Record<string, unknown>[];
  filename: string;
}

export default function ExportMenu({ data, filename }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const options = [
    { label: "Excel (.xls)", icon: "FileSpreadsheet", action: () => exportToExcel(data, filename) },
    { label: "CSV (.csv)", icon: "FileText", action: () => exportToCSV(data, filename) },
    { label: "JSON (.json)", icon: "Braces", action: () => exportToJSON(data, filename) },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all"
        style={{
          background: "hsl(142, 72%, 29%)",
          color: "white",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(142, 72%, 24%)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(142, 72%, 29%)")}
      >
        <Icon name="Download" size={14} />
        Выгрузить
        <Icon name="ChevronDown" size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 rounded-md overflow-hidden z-50 animate-fade-in"
          style={{
            background: "white",
            border: "1px solid hsl(220, 15%, 88%)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            minWidth: "160px",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => { opt.action(); setOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors"
              style={{ color: "hsl(220, 25%, 15%)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(142, 60%, 96%)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Icon name={opt.icon as "FileSpreadsheet"} size={14} className="text-green-700" />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
