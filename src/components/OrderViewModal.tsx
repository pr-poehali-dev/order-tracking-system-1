import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Order, ORDER_STATUSES } from "@/data/mockData";
import { useOrderTypes } from "@/context/OrderTypesContext";
import { useAuth } from "@/context/AuthContext";

interface Props {
  order: Order;
  onClose: () => void;
  onEdit?: () => void;
  onStatusChange?: (status: Order["status"]) => void;
}

const statusColorMap = Object.fromEntries(ORDER_STATUSES.map((s) => [s.value, s]));

export default function OrderViewModal({ order, onClose, onEdit, onStatusChange }: Props) {
  const { orderTypes } = useOrderTypes();
  const { currentUser } = useAuth();
  const orderTypeMap = Object.fromEntries(orderTypes.map((t) => [t.id, t]));
  const canEdit = currentUser.role === "admin" || currentUser.role === "marketer";
  const s = statusColorMap[order.status];
  const ot = order.orderTypeId ? orderTypeMap[order.orderTypeId] : null;

  const totalAmount = order.positions.reduce((sum, p) => {
    const a = parseFloat(p.amount.replace(/\s/g, "").replace(",", ".")) || 0;
    return sum + a;
  }, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-2xl rounded-xl animate-fade-in"
        style={{ background: "white", boxShadow: "0 16px 48px rgba(0,0,0,0.18)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 rounded-t-xl"
          style={{ borderBottom: "2px solid hsl(142, 65%, 40%)" }}
        >
          <div className="flex items-center gap-3">
            <span className="font-bold text-base font-mono" style={{ color: "hsl(142, 65%, 28%)" }}>
              {order.id}
            </span>
            {order.contractNumber && (
              <span className="text-sm font-mono" style={{ color: "hsl(220, 10%, 50%)" }}>
                {order.contractNumber}
              </span>
            )}
            {ot && (
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
            )}
          </div>
          <div className="flex items-center gap-2">
            {canEdit && onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{ border: "1px solid hsl(220,15%,85%)", color: "hsl(220,25%,20%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(220,15%,94%)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Icon name="Pencil" size={13} />
                Редактировать
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded transition-colors"
              style={{ color: "hsl(220, 10%, 55%)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(220, 25%, 15%)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(220, 10%, 55%)")}>
              <Icon name="X" size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Статус + даты */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: "hsl(220,10%,50%)" }}>Статус:</span>
              {onStatusChange ? (
                <StatusDropdown
                  current={order.status}
                  s={s}
                  onChange={onStatusChange}
                />
              ) : (
                <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium"
                  style={{ background: s?.bg, color: s?.text }}>
                  {s?.label ?? order.status}
                </span>
              )}
            </div>
            {order.date && (
              <div className="flex items-center gap-1.5">
                <Icon name="Calendar" size={12} style={{ color: "hsl(220,10%,55%)" }} />
                <span className="text-xs" style={{ color: "hsl(220,10%,50%)" }}>Создан: <strong>{order.date}</strong></span>
              </div>
            )}
            {order.agreementDate && (
              <div className="flex items-center gap-1.5">
                <Icon name="FileCheck" size={12} style={{ color: "hsl(220,10%,55%)" }} />
                <span className="text-xs" style={{ color: "hsl(220,10%,50%)" }}>Соглашение: <strong>{order.agreementDate}</strong></span>
              </div>
            )}
            {order.deliveryDate && (
              <div className="flex items-center gap-1.5">
                <Icon name="Truck" size={12} style={{ color: "hsl(220,10%,55%)" }} />
                <span className="text-xs" style={{ color: "hsl(220,10%,50%)" }}>Поставка: <strong>{order.deliveryDate}</strong></span>
              </div>
            )}
          </div>

          {/* Клиент */}
          <Section title="Клиент">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <InfoRow label="Заказчик" value={order.client} />
              <InfoRow label="Телефон" value={order.phone} />
              <InfoRow label="Область" value={order.region} />
              <InfoRow label="Город" value={order.city} />
              {order.address && <InfoRow label="Адрес" value={order.address} full />}
            </div>
          </Section>

          {/* Позиции */}
          <Section title={`Позиции (${order.positions.length})`}>
            <div className="space-y-2">
              {order.positions.map((pos, i) => (
                <div key={pos.id} className="rounded-lg p-3"
                  style={{ background: "hsl(220,20%,98%)", border: "1px solid hsl(220,15%,90%)" }}>
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "hsl(220,10%,50%)" }}>
                      #{i + 1}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-2" style={{ color: "hsl(220,25%,12%)" }}>
                    {pos.name || "—"}
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <span style={{ color: "hsl(220,10%,50%)" }}>Кол-во: </span>
                      <strong style={{ color: "hsl(220,25%,12%)" }}>{pos.quantity || "—"}</strong>
                    </div>
                    <div>
                      <span style={{ color: "hsl(220,10%,50%)" }}>Цена: </span>
                      <strong style={{ color: "hsl(220,25%,12%)" }}>
                        {pos.priceUnknown ? "Не просчитано" : (pos.price || "—")}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: "hsl(220,10%,50%)" }}>Сумма: </span>
                      <strong style={{ color: "hsl(142,65%,28%)" }}>
                        {pos.amountUnknown ? "Не просчитано" : (pos.amount || "—")}
                      </strong>
                    </div>
                  </div>
                  {pos.notes && (
                    <p className="text-xs mt-2 italic" style={{ color: "hsl(220,10%,50%)" }}>
                      {pos.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {totalAmount > 0 && (
              <div className="flex justify-end pt-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg"
                  style={{ background: "hsl(142,60%,96%)", border: "1px solid hsl(142,50%,80%)" }}>
                  <span className="text-sm font-medium" style={{ color: "hsl(142,65%,28%)" }}>Итого:</span>
                  <span className="text-sm font-bold font-mono" style={{ color: "hsl(142,65%,28%)" }}>
                    {totalAmount.toLocaleString("ru-RU")} руб.
                  </span>
                </div>
              </div>
            )}
          </Section>

          {/* Менеджер */}
          {order.manager && (
            <div className="flex items-center gap-2 text-xs" style={{ color: "hsl(220,10%,50%)" }}>
              <Icon name="User" size={12} />
              Менеджер: <strong style={{ color: "hsl(220,20%,25%)" }}>{order.manager}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: "hsl(220,10%,45%)" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value, full }: { label: string; value?: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <span className="text-xs" style={{ color: "hsl(220,10%,50%)" }}>{label}: </span>
      <span className="text-xs font-medium" style={{ color: "hsl(220,25%,12%)" }}>{value || "—"}</span>
    </div>
  );
}

function StatusDropdown({
  current,
  s,
  onChange,
}: {
  current: Order["status"];
  s: (typeof ORDER_STATUSES)[number] | undefined;
  onChange: (status: Order["status"]) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium transition-all cursor-pointer"
        style={{ background: s?.bg, color: s?.text }}
        title="Нажмите для смены статуса"
      >
        {s?.label ?? current}
        <Icon name="ChevronDown" size={10} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 rounded-lg overflow-hidden z-20 animate-fade-in"
            style={{ background: "white", border: "1px solid hsl(220,15%,88%)", boxShadow: "0 6px 20px rgba(0,0,0,0.12)", minWidth: "180px" }}>
            {ORDER_STATUSES.map((st) => (
              <button
                key={st.value}
                onClick={(e) => { e.stopPropagation(); onChange(st.value); setOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-left transition-colors"
                style={{ color: "hsl(220,20%,20%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = st.bg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: st.text }} />
                {st.label}
                {current === st.value && <Icon name="Check" size={11} className="ml-auto text-green-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}