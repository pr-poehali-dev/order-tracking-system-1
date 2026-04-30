import { useState } from "react";
import Icon from "@/components/ui/icon";
import HomePage from "@/pages/sections/HomePage";
import OrdersPage from "@/pages/sections/OrdersPage";
import UsersPage from "@/pages/sections/UsersPage";
import SettingsPage from "@/pages/sections/SettingsPage";

interface Props {
  onLogout: () => void;
}

type Section = "home" | "orders" | "users" | "settings";

const navItems: { id: Section; label: string; icon: string }[] = [
  { id: "home", label: "Главная", icon: "LayoutDashboard" },
  { id: "orders", label: "Заказы", icon: "ShoppingCart" },
  { id: "users", label: "Пользователи", icon: "Users" },
  { id: "settings", label: "Настройки", icon: "Settings" },
];

export default function Dashboard({ onLogout }: Props) {
  const [active, setActive] = useState<Section>("home");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "hsl(220, 20%, 97%)" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col h-full transition-all duration-200 flex-shrink-0"
        style={{
          width: collapsed ? "60px" : "220px",
          background: "hsl(220, 28%, 12%)",
          borderRight: "1px solid hsl(220, 25%, 18%)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center px-4 h-14 flex-shrink-0"
          style={{ borderBottom: "1px solid hsl(220, 25%, 18%)" }}
        >
          <div
            className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: "hsl(142, 72%, 29%)" }}
          >
            <Icon name="LayoutDashboard" size={14} className="text-white" />
          </div>
          {!collapsed && (
            <span className="ml-3 text-white font-semibold text-sm tracking-wide uppercase truncate">
              Заказы ОАО «Поставымебель»
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto p-1 rounded transition-colors"
            style={{ color: "hsl(220, 10%, 45%)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(220, 10%, 45%)")}
          >
            <Icon name={collapsed ? "PanelLeftOpen" : "PanelLeftClose"} size={14} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                title={collapsed ? item.label : undefined}
                className="flex items-center w-full transition-all duration-150 relative"
                style={{
                  padding: collapsed ? "10px 0" : "10px 16px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  background: isActive ? "hsl(142, 72%, 20%)" : "transparent",
                  color: isActive ? "hsl(142, 70%, 70%)" : "hsl(220, 10%, 55%)",
                  borderLeft: isActive ? "3px solid hsl(142, 72%, 40%)" : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "hsl(220, 25%, 18%)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon name={item.icon as "LayoutDashboard"} size={16} />
                {!collapsed && (
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ borderTop: "1px solid hsl(220, 25%, 18%)" }} className="p-3">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                style={{ background: "hsl(142, 50%, 22%)", color: "hsl(142, 70%, 70%)" }}
              >
                АД
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white truncate">Администратор</div>
                <div className="text-xs truncate" style={{ color: "hsl(220, 10%, 40%)" }}>admin@company.ru</div>
              </div>
              <button
                onClick={onLogout}
                className="p-1 rounded transition-colors"
                style={{ color: "hsl(220, 10%, 45%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(0, 72%, 65%)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(220, 10%, 45%)")}
                title="Выйти"
              >
                <Icon name="LogOut" size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogout}
              className="w-full flex justify-center p-1 rounded transition-colors"
              style={{ color: "hsl(220, 10%, 45%)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(0, 72%, 65%)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(220, 10%, 45%)")}
              title="Выйти"
            >
              <Icon name="LogOut" size={14} />
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header
          className="h-14 flex items-center px-6 flex-shrink-0"
          style={{
            background: "white",
            borderBottom: "1px solid hsl(220, 15%, 88%)",
          }}
        >
          <div>
            <h1 className="font-semibold text-sm" style={{ color: "hsl(220, 25%, 12%)" }}>
              {navItems.find((n) => n.id === active)?.label}
            </h1>
            <p className="text-xs" style={{ color: "hsl(220, 10%, 55%)" }}>
              30 апреля 2026
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              className="relative p-2 rounded-md transition-colors"
              style={{ color: "hsl(220, 10%, 50%)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(220, 15%, 94%)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Icon name="Bell" size={16} />
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: "hsl(142, 72%, 35%)" }}
              />
            </button>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{ background: "hsl(142, 50%, 22%)", color: "hsl(142, 70%, 50%)" }}
            >
              АД
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6">
          {active === "home" && <HomePage />}
          {active === "orders" && <OrdersPage />}
          {active === "users" && <UsersPage />}
          {active === "settings" && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}