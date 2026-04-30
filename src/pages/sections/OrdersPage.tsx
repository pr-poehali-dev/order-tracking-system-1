import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";
import ExportMenu from "@/components/ExportMenu";
import OrderForm from "@/components/OrderForm";
import { orders as initialOrders, Order, ORDER_STATUSES } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";

const PRODUCTION_STATUSES = ORDER_STATUSES.filter((s) =>
  ["processing", "assembly", "completed", "cancelled"].includes(s.value)
);

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser.role === "admin";
  const isMarketer = currentUser.role === "marketer";
  const isProduction = currentUser.role === "production";

  const canEdit = isAdmin || isMarketer;
  const canDelete = isAdmin;

  const [orderList, setOrderList] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState<keyof Order>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [formOpen, setFormOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [statusMenuId, setStatusMenuId] = useState<string | null>(null);

  const statusColorMap = Object.fromEntries(ORDER_STATUSES.map((s) => [s.value, s]));

  const filtered = useMemo(() => {
    let list = [...orderList];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((o) =>
        o.id.toLowerCase().includes(q) ||
        o.client.toLowerCase().includes(q) ||
        (o.contractNumber ?? "").toLowerCase().includes(q)
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
  }, [orderList, search, statusFilter, sortBy, sortDir]);

  const exportData = filtered.map((o) => ({
    "Номер": o.id,
    "Договор": o.contractNumber,
    "Клиент": o.client,
    "Телефон": o.phone,
    "Регион": `${o.region}, ${o.city}`,
    "Адрес": o.address,
    "Сумма": o.amount,
    "Статус": statusColorMap[o.status]?.label ?? o.status,
    "Дата поставки": o.deliveryDate,
    "Менеджер": o.manager,
  }));

  const toggleSort = (col: keyof Order) => {
    if (sortBy === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  const handleSave = (order: Order) => {
    setOrderList((list) =>
      editOrder ? list.map((o) => (o.id === order.id ? order : o)) : [order, ...list]
    );
    setFormOpen(false);
    setEditOrder(null);
  };

  const handleStatusChange = (orderId: string, status: Order["status"]) => {
    setOrderList((list) => list.map((o) => o.id === orderId ? { ...o, status } : o));
    setStatusMenuId(null);
  };

  const handleDelete = (id: string) => {
    setOrderList((list) => list.filter((o) => o.id !== id));
    setDeleteConfirm(null);
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
        <div className="flex items-center gap-2 flex-1 min-w-48 rounded-md px-3 py-2"
          style={{ background: "white", border: "1px solid hsl(220, 15%, 88%)" }}>
          <Icon name="Search" size={14} style={{ color: "hsl(220, 10%, 55%)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по номеру, клиенту, договору..."
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
          style={{ background: "white", border: "1px solid hsl(220, 15%, 88%)", color: "hsl(220, 25%, 20%)" }}
        >
          <option value="">Все статусы</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <ExportMenu data={exportData} filename="заказы" />

        {canEdit && (
          <button
            onClick={() => { setEditOrder(null); setFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white transition-all"
            style={{ background: "hsl(142, 65%, 30%)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(142, 65%, 24%)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(142, 65%, 30%)")}
          >
            <Icon name="Plus" size={14} />
            Новый заказ
          </button>
        )}
      </div>

      {/* Role hint for production */}
      {isProduction && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm"
          style={{ background: "hsl(142, 60%, 95%)", border: "1px solid hsl(142, 50%, 80%)", color: "hsl(142, 65%, 28%)" }}>
          <Icon name="Info" size={14} />
          Вы можете просматривать заказы и изменять их статус
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg overflow-hidden"
        style={{ background: "white", border: "1px solid hsl(220, 15%, 88%)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "hsl(220, 20%, 98%)", borderBottom: "1px solid hsl(220, 15%, 90%)" }}>
                {[
                  { label: "Номер", col: "id" as keyof Order },
                  { label: "Договор", col: "contractNumber" as keyof Order },
                  { label: "Клиент", col: "client" as keyof Order },
                  { label: "Регион", col: "region" as keyof Order },
                  { label: "Сумма, руб.", col: "amount" as keyof Order },
                  { label: "Статус", col: "status" as keyof Order },
                  { label: "Поставка", col: "deliveryDate" as keyof Order },
                ].map((h) => (
                  <th key={h.col}
                    onClick={() => toggleSort(h.col)}
                    className="px-5 py-3 text-left cursor-pointer select-none"
                    style={{ color: "hsl(220, 10%, 45%)" }}>
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                      {h.label}
                      <SortIcon col={h.col} />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-right"
                  style={{ color: "hsl(220, 10%, 45%)" }}>
                  {isProduction ? "Статус" : "Действия"}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm"
                    style={{ color: "hsl(220, 10%, 55%)" }}>
                    Ничего не найдено
                  </td>
                </tr>
              ) : (
                filtered.map((order, i) => {
                  const s = statusColorMap[order.status];
                  return (
                    <tr key={order.id} className="row-hover"
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid hsl(220, 15%, 94%)" : "none" }}>
                      <td className="px-5 py-3 font-mono text-xs font-semibold"
                        style={{ color: "hsl(142, 65%, 30%)" }}>
                        {order.id}
                      </td>
                      <td className="px-5 py-3 font-mono text-xs" style={{ color: "hsl(220, 10%, 50%)" }}>
                        {order.contractNumber}
                      </td>
                      <td className="px-5 py-3 text-sm" style={{ color: "hsl(220, 25%, 15%)" }}>
                        {order.client}
                      </td>
                      <td className="px-5 py-3 text-sm" style={{ color: "hsl(220, 15%, 40%)" }}>
                        {order.region && order.city ? `${order.region}, ${order.city}` : "—"}
                      </td>
                      <td className="px-5 py-3 font-mono text-sm font-medium"
                        style={{ color: "hsl(220, 25%, 15%)" }}>
                        {order.amount > 0 ? order.amount.toLocaleString("ru-RU") : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium"
                          style={{ background: s?.bg, color: s?.text }}>
                          {s?.label ?? order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs font-mono" style={{ color: "hsl(220, 10%, 50%)" }}>
                        {order.deliveryDate || "—"}
                      </td>

                      {/* Actions column */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* Production: change status dropdown */}
                          {isProduction && (
                            <div className="relative">
                              <button
                                onClick={() => setStatusMenuId(statusMenuId === order.id ? null : order.id)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all"
                                style={{ border: "1px solid hsl(220,15%,85%)", color: "hsl(220,25%,20%)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(220,15%,94%)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                              >
                                <Icon name="RefreshCw" size={11} />
                                Статус
                                <Icon name="ChevronDown" size={10} />
                              </button>
                              {statusMenuId === order.id && (
                                <div className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-50 animate-fade-in"
                                  style={{ background: "white", border: "1px solid hsl(220,15%,88%)", boxShadow: "0 6px 20px rgba(0,0,0,0.12)", minWidth: "180px" }}>
                                  {PRODUCTION_STATUSES.map((st) => (
                                    <button
                                      key={st.value}
                                      onClick={() => handleStatusChange(order.id, st.value)}
                                      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-left transition-colors"
                                      style={{ color: "hsl(220,20%,20%)" }}
                                      onMouseEnter={(e) => (e.currentTarget.style.background = st.bg)}
                                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                    >
                                      <span className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ background: st.text }} />
                                      {st.label}
                                      {order.status === st.value && (
                                        <Icon name="Check" size={11} className="ml-auto text-green-600" />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Admin/Marketer: edit */}
                          {canEdit && (
                            <button
                              onClick={() => { setEditOrder(order); setFormOpen(true); }}
                              className="p-1.5 rounded transition-colors" title="Редактировать"
                              style={{ color: "hsl(220, 10%, 55%)" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "hsl(220,15%,93%)"; e.currentTarget.style.color = "hsl(220,25%,20%)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "hsl(220,10%,55%)"; }}>
                              <Icon name="Pencil" size={13} />
                            </button>
                          )}

                          {/* Admin only: delete */}
                          {canDelete && (
                            <button
                              onClick={() => setDeleteConfirm(order.id)}
                              className="p-1.5 rounded transition-colors" title="Удалить"
                              style={{ color: "hsl(220, 10%, 55%)" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "hsl(0,60%,95%)"; e.currentTarget.style.color = "hsl(0,65%,45%)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "hsl(220,10%,55%)"; }}>
                              <Icon name="Trash2" size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: "1px solid hsl(220, 15%, 92%)", background: "hsl(220, 20%, 98%)" }}>
          <span className="text-xs" style={{ color: "hsl(220, 10%, 55%)" }}>
            Показано: <strong>{filtered.length}</strong> из {orderList.length}
          </span>
          <span className="text-sm font-semibold font-mono" style={{ color: "hsl(220, 25%, 15%)" }}>
            Итого: {total > 0 ? total.toLocaleString("ru-RU") + " руб." : "—"}
          </span>
        </div>
      </div>

      {/* Form modal */}
      {formOpen && canEdit && (
        <OrderForm
          initial={editOrder}
          onSave={handleSave}
          onCancel={() => { setFormOpen(false); setEditOrder(null); }}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="w-full max-w-sm rounded-xl p-6 animate-fade-in"
            style={{ background: "white", boxShadow: "0 16px 48px rgba(0,0,0,0.18)" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "hsl(0,60%,95%)" }}>
                <Icon name="Trash2" size={18} style={{ color: "hsl(0,65%,45%)" }} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: "hsl(220,25%,12%)" }}>Удалить заказ?</div>
                <div className="text-xs mt-0.5" style={{ color: "hsl(220,10%,50%)" }}>Это действие нельзя отменить</div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ border: "1px solid hsl(220,15%,85%)", color: "hsl(220,25%,20%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(220,15%,96%)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                Отмена
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: "hsl(0,65%,48%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(0,65%,40%)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(0,65%,48%)")}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
