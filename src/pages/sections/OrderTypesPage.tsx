import { useState } from "react";
import Icon from "@/components/ui/icon";
import { OrderType } from "@/data/mockData";
import { useOrderTypes } from "@/context/OrderTypesContext";
import { useAuth } from "@/context/AuthContext";

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16",
  "#10b981", "#06b6d4", "#6366f1", "#8b5cf6",
  "#ec4899", "#64748b",
];

const emptyForm = () => ({ name: "", color: PRESET_COLORS[6] });

export default function OrderTypesPage() {
  const { orderTypes, setOrderTypes } = useOrderTypes();
  const { currentUser } = useAuth();
  const canEdit = currentUser.role === "admin" || currentUser.role === "marketer";

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<OrderType | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [formError, setFormError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm());
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (ot: OrderType) => {
    setEditItem(ot);
    setForm({ name: ot.name, color: ot.color });
    setFormError("");
    setFormOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { setFormError("Введите название типа"); return; }
    if (editItem) {
      setOrderTypes(orderTypes.map((t) => t.id === editItem.id ? { ...t, ...form } : t));
    } else {
      const newType: OrderType = {
        id: `OT-${String(Date.now()).slice(-4)}`,
        name: form.name.trim(),
        color: form.color,
      };
      setOrderTypes([...orderTypes, newType]);
    }
    setFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setOrderTypes(orderTypes.filter((t) => t.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold" style={{ color: "hsl(220,25%,12%)" }}>Типы заказов</h2>
          <p className="text-xs mt-0.5" style={{ color: "hsl(220,10%,50%)" }}>
            Справочник для классификации заказов
          </p>
        </div>
        {canEdit && (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white transition-all"
            style={{ background: "hsl(142, 65%, 30%)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(142, 65%, 24%)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(142, 65%, 30%)")}
          >
            <Icon name="Plus" size={14} />
            Добавить тип
          </button>
        )}
      </div>

      <div className="rounded-lg overflow-hidden"
        style={{ background: "white", border: "1px solid hsl(220, 15%, 88%)" }}>
        {orderTypes.length === 0 ? (
          <div className="py-14 text-center text-sm" style={{ color: "hsl(220, 10%, 55%)" }}>
            Нет типов заказов. Добавьте первый.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ background: "hsl(220, 20%, 98%)", borderBottom: "1px solid hsl(220, 15%, 90%)" }}>
                {["Тип заказа", "Цвет", "Предпросмотр", ...(canEdit ? [""] : [])].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "hsl(220, 10%, 45%)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderTypes.map((ot, i) => (
                <tr key={ot.id} className="row-hover"
                  style={{ borderBottom: i < orderTypes.length - 1 ? "1px solid hsl(220, 15%, 94%)" : "none" }}>
                  <td className="px-5 py-3.5 text-sm font-medium" style={{ color: "hsl(220,25%,12%)" }}>
                    {ot.name}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border border-white shadow-sm"
                        style={{ background: ot.color, boxShadow: `0 0 0 2px ${ot.color}33` }} />
                      <span className="text-xs font-mono" style={{ color: "hsl(220,10%,50%)" }}>{ot.color}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        background: ot.color + "22",
                        color: ot.color,
                        border: `1px solid ${ot.color}55`,
                      }}
                    >
                      {ot.name}
                    </span>
                  </td>
                  {canEdit && (
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(ot)}
                          className="p-1.5 rounded transition-colors" title="Редактировать"
                          style={{ color: "hsl(220, 10%, 55%)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "hsl(220,15%,93%)"; e.currentTarget.style.color = "hsl(220,25%,20%)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "hsl(220,10%,55%)"; }}>
                          <Icon name="Pencil" size={13} />
                        </button>
                        <button onClick={() => setDeleteConfirm(ot.id)}
                          className="p-1.5 rounded transition-colors" title="Удалить"
                          style={{ color: "hsl(220, 10%, 55%)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "hsl(0,60%,96%)"; e.currentTarget.style.color = "hsl(0,65%,45%)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "hsl(220,10%,55%)"; }}>
                          <Icon name="Trash2" size={13} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="px-5 py-3 text-xs"
          style={{ borderTop: "1px solid hsl(220, 15%, 92%)", background: "hsl(220, 20%, 98%)", color: "hsl(220, 10%, 55%)" }}>
          Всего: <strong>{orderTypes.length}</strong> типов
        </div>
      </div>

      {/* Form modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={(e) => e.target === e.currentTarget && setFormOpen(false)}>
          <div className="w-full max-w-sm rounded-xl animate-fade-in"
            style={{ background: "white", boxShadow: "0 16px 48px rgba(0,0,0,0.18)" }}>
            <div className="flex items-center justify-between px-6 py-4 rounded-t-xl"
              style={{ borderBottom: "2px solid hsl(142, 65%, 40%)" }}>
              <h2 className="font-bold text-base" style={{ color: "hsl(142, 65%, 28%)" }}>
                {editItem ? "Редактировать тип" : "Новый тип заказа"}
              </h2>
              <button onClick={() => setFormOpen(false)} className="p-1 rounded"
                style={{ color: "hsl(220, 10%, 55%)" }}>
                <Icon name="X" size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "hsl(220,20%,20%)" }}>
                  Название типа
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Например: Корпоративный"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: "1px solid hsl(220,15%,84%)", color: "hsl(220,25%,12%)" }}
                  onFocus={(e) => (e.target.style.borderColor = "hsl(142,65%,40%)")}
                  onBlur={(e) => (e.target.style.borderColor = "hsl(220,15%,84%)")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "hsl(220,20%,20%)" }}>
                  Цвет
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setForm({ ...form, color: c })}
                      className="w-7 h-7 rounded-full transition-transform"
                      style={{
                        background: c,
                        outline: form.color === c ? `3px solid ${c}` : "none",
                        outlineOffset: "2px",
                        transform: form.color === c ? "scale(1.15)" : "scale(1)",
                      }}
                    />
                  ))}
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-7 h-7 rounded-full cursor-pointer border-0 p-0"
                    title="Свой цвет"
                    style={{ background: "none" }}
                  />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: "hsl(220,20%,97%)", border: "1px solid hsl(220,15%,90%)" }}>
                  <span className="text-xs" style={{ color: "hsl(220,10%,55%)" }}>Предпросмотр:</span>
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: form.color + "22",
                      color: form.color,
                      border: `1px solid ${form.color}55`,
                    }}
                  >
                    {form.name || "Название типа"}
                  </span>
                </div>
              </div>

              {formError && (
                <div className="text-xs flex items-center gap-1.5" style={{ color: "hsl(0,65%,50%)" }}>
                  <Icon name="AlertCircle" size={12} />
                  {formError}
                </div>
              )}

              <button onClick={handleSave}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
                style={{ background: "hsl(142, 65%, 30%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(142, 65%, 24%)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(142, 65%, 30%)")}>
                {editItem ? "Сохранить" : "Добавить тип"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="w-full max-w-sm rounded-xl p-6 animate-fade-in"
            style={{ background: "white", boxShadow: "0 16px 48px rgba(0,0,0,0.18)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "hsl(0,60%,95%)" }}>
                <Icon name="Trash2" size={18} style={{ color: "hsl(0,65%,45%)" }} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: "hsl(220,25%,12%)" }}>Удалить тип заказа?</div>
                <div className="text-xs mt-0.5" style={{ color: "hsl(220,10%,50%)" }}>Это действие нельзя отменить</div>
              </div>
            </div>
            <div className="flex gap-2">
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
