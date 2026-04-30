import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";
import ExportMenu from "@/components/ExportMenu";
import { orders, Order } from "@/data/mockData";

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: "hsl(210, 80%, 93%)", text: "hsl(210, 72%, 35%)", label: "Новый" },
  processing: { bg: "hsl(38, 90%, 93%)", text: "hsl(38, 72%, 35%)", label: "В работе" },
  shipped: { bg: "hsl(260, 70%, 93%)", text: "hsl(260, 60%, 40%)", label: "Отгружен" },
  completed: { bg: "hsl(142, 60%, 92%)", text: "hsl(142, 65%, 28%)", label: "Выполнен" },
  cancelled: { bg: "hsl(0, 60%, 93%)", text: "hsl(0, 65%, 40%)", label: "Отменён" },
};

const statusOptions = [
  { value: "", label: "Все статусы" },
  { value: "new", label: "Новый" },
  { value: "processing", label: "В работе" },
  { value: "shipped", label: "Отгружен" },
  { value: "completed", label: "Выполнен" },
  { value: "cancelled", label: "Отменён" },
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState<keyof Order>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let list = [...orders];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((o) =>
        o.id.toLowerCase().includes(q) ||
        o.client.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q)
      );
    }
    if (statusFilter) list = list.filter((o) => o.status === statusFilter);
    list.sort((a, b) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      const cmp = String(av).localeCompare(String(bv), "ru", { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [search, statusFilter, sortBy, sortDir]);

  const exportData = filtered.map((o) => ({
    "Номер": o.id,
    "Клиент": o.client,
    "Продукция": o.product,
    "Сумма": o.amount,
    "Статус": statusColors[o.status].label,
    "Дата": o.date,
    "Менеджер": o.manager,
  }));

  const toggleSort = (col: keyof Order) => {
    if (sortBy === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: keyof Order }) =>
    sortBy === col ? (
      <Icon name={sortDir === "asc" ? "ChevronUp" : "ChevronDown"} size={12} className="text-green-600" />
    ) : (
      <Icon name="ChevronsUpDown" size={12} style={{ color: "hsl(220, 10%, 65%)" }} />
    );

  const total = filtered.reduce((s, o) => s + o.amount, 0);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex items-center gap-2 flex-1 min-w-48 rounded-md px-3 py-2"
          style={{ background: "white", border: "1px solid hsl(220, 15%, 88%)" }}
        >
          <Icon name="Search" size={14} style={{ color: "hsl(220, 10%, 55%)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по номеру, клиенту..."
            className="flex-1 outline-none text-sm bg-transparent"
            style={{ color: "hsl(220, 25%, 12%)" }}
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <Icon name="X" size={12} style={{ color: "hsl(220, 10%, 55%)" }} />
            </button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md px-3 py-2 text-sm outline-none"
          style={{
            background: "white",
            border: "1px solid hsl(220, 15%, 88%)",
            color: "hsl(220, 25%, 20%)",
          }}
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <ExportMenu data={exportData} filename="заказы" />
      </div>

      {/* Table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ background: "white", border: "1px solid hsl(220, 15%, 88%)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "hsl(220, 20%, 98%)", borderBottom: "1px solid hsl(220, 15%, 90%)" }}>
                {[
                  { label: "Номер", col: "id" as keyof Order },
                  { label: "Клиент", col: "client" as keyof Order },
                  { label: "Продукция", col: "product" as keyof Order },
                  { label: "Сумма, ₽", col: "amount" as keyof Order },
                  { label: "Статус", col: "status" as keyof Order },
                  { label: "Дата", col: "date" as keyof Order },
                  { label: "Менеджер", col: "manager" as keyof Order },
                ].map((h) => (
                  <th
                    key={h.col}
                    onClick={() => toggleSort(h.col)}
                    className="px-5 py-3 text-left cursor-pointer select-none"
                    style={{ color: "hsl(220, 10%, 45%)" }}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                      {h.label}
                      <SortIcon col={h.col} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm"
                    style={{ color: "hsl(220, 10%, 55%)" }}>
                    Ничего не найдено
                  </td>
                </tr>
              ) : (
                filtered.map((order, i) => {
                  const s = statusColors[order.status];
                  return (
                    <tr
                      key={order.id}
                      className="row-hover"
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid hsl(220, 15%, 94%)" : "none" }}
                    >
                      <td className="px-5 py-3 font-mono text-xs font-semibold"
                        style={{ color: "hsl(142, 65%, 30%)" }}>
                        {order.id}
                      </td>
                      <td className="px-5 py-3 text-sm" style={{ color: "hsl(220, 25%, 15%)" }}>
                        {order.client}
                      </td>
                      <td className="px-5 py-3 text-sm" style={{ color: "hsl(220, 15%, 35%)" }}>
                        {order.product}
                      </td>
                      <td className="px-5 py-3 font-mono text-sm font-medium"
                        style={{ color: "hsl(220, 25%, 15%)" }}>
                        {order.amount.toLocaleString("ru-RU")}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium"
                          style={{ background: s.bg, color: s.text }}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs font-mono"
                        style={{ color: "hsl(220, 10%, 50%)" }}>
                        {order.date}
                      </td>
                      <td className="px-5 py-3 text-sm"
                        style={{ color: "hsl(220, 15%, 40%)" }}>
                        {order.manager}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: "1px solid hsl(220, 15%, 92%)", background: "hsl(220, 20%, 98%)" }}
        >
          <span className="text-xs" style={{ color: "hsl(220, 10%, 55%)" }}>
            Показано: <strong>{filtered.length}</strong> из {orders.length}
          </span>
          <span className="text-sm font-semibold font-mono" style={{ color: "hsl(220, 25%, 15%)" }}>
            Итого: {total.toLocaleString("ru-RU")} ₽
          </span>
        </div>
      </div>
    </div>
  );
}
