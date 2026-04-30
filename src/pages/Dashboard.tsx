import { useState, useRef, useEffect } from "react";
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "hsl(220, 20%, 97%)" }}>
      {/* Header */}
      <header
        className="flex-shrink-0 flex items-center px-6 h-14 gap-6"
        style={{ background: "hsl(220, 28%, 12%)", borderBottom: "1px solid hsl(220, 25%, 18%)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0 mr-4">
          <div
            className="w-7 h-7 rounded flex items-center justify-center"
            style={{ background: "hsl(142, 65%, 40%)" }}
          >
            <Icon name="TrendingUp" size={14} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-wide hidden md:block">
            Заказы ОАО «Поставымебель»
          </span>
        </div>

        {/* Nav tabs */}
        <nav className="flex items-center gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all"
                style={{
                  background: isActive ? "hsl(142, 65%, 28%)" : "transparent",
                  color: isActive ? "white" : "hsl(220, 10%, 60%)",
                  borderBottom: isActive ? "2px solid hsl(142, 65%, 50%)" : "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "hsl(220, 25%, 20%)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon name={item.icon as "LayoutDashboard"} size={15} />
                <span className="hidden sm:block">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Bell */}
          <button
            className="relative p-2 rounded-md transition-colors"
            style={{ color: "hsl(220, 10%, 55%)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(220, 25%, 20%)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Icon name="Bell" size={16} />
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ background: "hsl(142, 65%, 45%)" }}
            />
          </button>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors"
              style={{ color: "hsl(220, 10%, 75%)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(220, 25%, 20%)")}
              onMouseLeave={(e) => !userMenuOpen && (e.currentTarget.style.background = "transparent")}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                style={{ background: "hsl(142, 50%, 22%)", color: "hsl(142, 70%, 65%)" }}
              >
                АД
              </div>
              <span className="text-sm font-medium hidden sm:block">Администратор</span>
              <Icon
                name="ChevronDown"
                size={13}
                className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown — как на скриншоте */}
            {userMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden z-50 animate-fade-in"
                style={{
                  background: "white",
                  border: "1px solid hsl(220, 15%, 88%)",
                  boxShadow: "0 8px 28px rgba(0,0,0,0.14)",
                  minWidth: "200px",
                }}
              >
                {/* User info */}
                <div className="px-4 py-3" style={{ borderBottom: "1px solid hsl(220, 15%, 92%)" }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                      style={{ background: "hsl(142, 50%, 90%)", color: "hsl(142, 65%, 28%)" }}
                    >
                      АД
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "hsl(220, 25%, 12%)" }}>
                        Администратор
                      </div>
                      <div className="text-xs" style={{ color: "hsl(220, 10%, 55%)" }}>
                        Администратор
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1.5">
                  <DropItem
                    icon="Users"
                    label="Пользователи"
                    onClick={() => { setActive("users"); setUserMenuOpen(false); }}
                  />
                  <DropItem
                    icon="Settings"
                    label="Настройки"
                    onClick={() => { setActive("settings"); setUserMenuOpen(false); }}
                  />
                </div>

                <div style={{ borderTop: "1px solid hsl(220, 15%, 92%)" }} className="py-1.5">
                  <DropItem
                    icon="LogOut"
                    label="Выйти"
                    danger
                    onClick={onLogout}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {active === "home" && <HomePage />}
        {active === "orders" && <OrdersPage />}
        {active === "users" && <UsersPage />}
        {active === "settings" && <SettingsPage />}
      </main>
    </div>
  );
}

function DropItem({
  icon, label, onClick, danger,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors text-left"
      style={{ color: danger ? "hsl(0, 65%, 45%)" : "hsl(220, 20%, 20%)" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = danger ? "hsl(0, 60%, 97%)" : "hsl(220, 15%, 96%)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <Icon name={icon as "Users"} size={15} style={{ color: danger ? "hsl(0, 65%, 48%)" : "hsl(220, 10%, 50%)" }} />
      {label}
    </button>
  );
}
