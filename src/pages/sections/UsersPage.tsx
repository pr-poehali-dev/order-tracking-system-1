import { useState } from "react";
import Icon from "@/components/ui/icon";
import ExportMenu from "@/components/ExportMenu";
import { users } from "@/data/mockData";

const roleMap: Record<string, { label: string; bg: string; text: string }> = {
  admin: { label: "Администратор", bg: "hsl(220, 70%, 92%)", text: "hsl(220, 65%, 35%)" },
  manager: { label: "Менеджер", bg: "hsl(38, 85%, 92%)", text: "hsl(38, 72%, 35%)" },
  viewer: { label: "Наблюдатель", bg: "hsl(220, 15%, 92%)", text: "hsl(220, 10%, 40%)" },
};

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const exportData = filtered.map((u) => ({
    "ID": u.id,
    "Имя": u.name,
    "Email": u.email,
    "Роль": roleMap[u.role].label,
    "Статус": u.status === "active" ? "Активен" : "Неактивен",
    "Последний вход": u.lastLogin,
    "Заказов": u.ordersCount,
  }));

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
            placeholder="Поиск по имени или email..."
            className="flex-1 outline-none text-sm bg-transparent"
            style={{ color: "hsl(220, 25%, 12%)" }}
          />
        </div>
        <ExportMenu data={exportData} filename="пользователи" />
      </div>

      {/* Table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ background: "white", border: "1px solid hsl(220, 15%, 88%)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ background: "hsl(220, 20%, 98%)", borderBottom: "1px solid hsl(220, 15%, 90%)" }}>
              {["Пользователь", "Роль", "Статус", "Последний вход", "Заказов"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "hsl(220, 10%, 45%)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => {
              const role = roleMap[user.role];
              const isActive = user.status === "active";
              return (
                <tr
                  key={user.id}
                  className="row-hover"
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid hsl(220, 15%, 94%)" : "none" }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                        style={{
                          background: "hsl(142, 50%, 90%)",
                          color: "hsl(142, 65%, 28%)",
                        }}
                      >
                        {user.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: "hsl(220, 25%, 12%)" }}>
                          {user.name}
                        </div>
                        <div className="text-xs font-mono" style={{ color: "hsl(220, 10%, 50%)" }}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium"
                      style={{ background: role.bg, color: role.text }}>
                      {role.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: isActive ? "hsl(142, 72%, 40%)" : "hsl(220, 10%, 65%)" }}
                      />
                      <span className="text-xs" style={{ color: isActive ? "hsl(142, 65%, 30%)" : "hsl(220, 10%, 50%)" }}>
                        {isActive ? "Активен" : "Неактивен"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-mono" style={{ color: "hsl(220, 10%, 50%)" }}>
                    {user.lastLogin}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-mono font-medium"
                    style={{ color: "hsl(220, 25%, 20%)" }}>
                    {user.ordersCount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div
          className="px-5 py-3 text-xs"
          style={{ borderTop: "1px solid hsl(220, 15%, 92%)", background: "hsl(220, 20%, 98%)", color: "hsl(220, 10%, 55%)" }}
        >
          Всего: <strong>{filtered.length}</strong> пользователей
        </div>
      </div>
    </div>
  );
}
