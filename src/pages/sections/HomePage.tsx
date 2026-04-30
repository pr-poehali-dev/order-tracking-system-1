import Icon from "@/components/ui/icon";
import { statsCards, orders, ORDER_STATUSES } from "@/data/mockData";
import { useSettings } from "@/context/SettingsContext";

const statusColors = Object.fromEntries(ORDER_STATUSES.map((s) => [s.value, s]));

function getRowHighlight(deliveryDate: string, rules: { days: number; color: string }[]): string | null {
  if (!deliveryDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const delivery = new Date(deliveryDate);
  delivery.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((delivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const sorted = [...rules].sort((a, b) => a.days - b.days);
  for (const rule of sorted) {
    if (diffDays <= rule.days && diffDays >= 0) return rule.color;
  }
  return null;
}

export default function HomePage() {
  const { rules } = useSettings();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statsCards.map((card, i) => (
          <div
            key={card.title}
            className="rounded-lg p-5"
            style={{
              background: "white",
              border: "1px solid hsl(220, 15%, 88%)",
              animationDelay: `${i * 60}ms`,
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "hsl(220, 10%, 55%)" }}>
                  {card.title}
                </p>
                <p className="text-2xl font-semibold font-mono" style={{ color: "hsl(220, 25%, 12%)" }}>
                  {card.value}
                </p>
              </div>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "hsl(142, 60%, 92%)" }}
              >
                <Icon name={card.icon as "TrendingUp"} size={16} className="text-green-700" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <Icon
                name={card.trend === "up" ? "TrendingUp" : "TrendingDown"}
                size={12}
                className={card.trend === "up" ? "text-green-600" : "text-red-500"}
              />
              <span
                className="text-xs font-medium"
                style={{ color: card.trend === "up" ? "hsl(142, 65%, 35%)" : "hsl(0, 65%, 45%)" }}
              >
                {card.change}
              </span>
              <span className="text-xs" style={{ color: "hsl(220, 10%, 60%)" }}>за месяц</span>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      {rules.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs" style={{ color: "hsl(220, 10%, 55%)" }}>Подсветка:</span>
          {rules.map((r) => (
            <div key={r.id} className="flex items-center gap-1.5 text-xs rounded-md px-2 py-1"
              style={{ background: r.color, color: "hsl(220,25%,15%)", border: "1px solid hsl(220,15%,82%)" }}>
              <span>≤ {r.days} дн.</span>
              {r.label && <span>— {r.label}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Recent orders */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ background: "white", border: "1px solid hsl(220, 15%, 88%)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid hsl(220, 15%, 92%)" }}
        >
          <h2 className="font-semibold text-sm" style={{ color: "hsl(220, 25%, 12%)" }}>
            Последние заказы
          </h2>
          <span className="text-xs px-2 py-1 rounded-full"
            style={{ background: "hsl(142, 60%, 92%)", color: "hsl(142, 65%, 28%)" }}>
            {orders.length} записей
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "hsl(220, 20%, 98%)" }}>
                {["Номер", "Клиент", "Сумма, руб.", "Статус", "Поставка"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "hsl(220, 10%, 50%)", borderBottom: "1px solid hsl(220, 15%, 90%)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 7).map((order, i) => {
                const s = statusColors[order.status];
                const highlight = getRowHighlight(order.deliveryDate, rules);
                return (
                  <tr
                    key={order.id}
                    style={{
                      borderBottom: i < 6 ? "1px solid hsl(220, 15%, 94%)" : "none",
                      background: highlight ?? "transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    <td className="px-5 py-3 font-mono text-xs font-medium" style={{ color: "hsl(220, 25%, 20%)" }}>
                      {order.id}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: "hsl(220, 25%, 15%)" }}>
                      {order.client}
                    </td>
                    <td className="px-5 py-3 font-mono text-sm font-medium" style={{ color: "hsl(220, 25%, 15%)" }}>
                      {order.amount > 0 ? order.amount.toLocaleString("ru-RU") : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded text-xs font-medium"
                        style={{ background: s.bg, color: s.text }}
                      >
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs font-mono" style={{ color: "hsl(220, 10%, 50%)" }}>
                      {order.deliveryDate || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}