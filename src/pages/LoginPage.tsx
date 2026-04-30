import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Заполните все поля");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 800);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(220, 28%, 10%)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{ background: "hsl(220, 28%, 8%)", borderRight: "1px solid hsl(220, 25%, 18%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center"
            style={{ background: "hsl(142, 72%, 29%)" }}>
            <Icon name="LayoutDashboard" size={16} className="text-white" />
          </div>
          <span className="text-white font-semibold tracking-wide text-sm uppercase">AdminPanel</span>
        </div>

        <div>
          <div className="mb-8">
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-1 rounded-full flex-1"
                  style={{ background: i === 1 ? "hsl(142, 72%, 29%)" : "hsl(220, 25%, 22%)" }} />
              ))}
            </div>
            <blockquote className="text-xl font-light leading-relaxed"
              style={{ color: "hsl(220, 15%, 80%)" }}>
              Полный контроль над бизнес-процессами — заказы, клиенты, аналитика и выгрузка отчётов в одном месте.
            </blockquote>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{ background: "hsl(142, 72%, 29%)", color: "white" }}>АД</div>
            <div>
              <div className="text-sm font-medium text-white">Администратор</div>
              <div className="text-xs" style={{ color: "hsl(220, 10%, 50%)" }}>Главный доступ</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Заказов", value: "1 248" },
            { label: "Клиентов", value: "342" },
            { label: "Выручка", value: "₽4.2М" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg p-4"
              style={{ background: "hsl(220, 25%, 14%)", border: "1px solid hsl(220, 25%, 20%)" }}>
              <div className="text-xl font-semibold text-white">{stat.value}</div>
              <div className="text-xs mt-1" style={{ color: "hsl(220, 10%, 50%)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded flex items-center justify-center"
              style={{ background: "hsl(142, 72%, 29%)" }}>
              <Icon name="LayoutDashboard" size={16} className="text-white" />
            </div>
            <span className="text-white font-semibold tracking-wide text-sm uppercase">AdminPanel</span>
          </div>

          <h1 className="text-2xl font-semibold text-white mb-1">Вход в систему</h1>
          <p className="text-sm mb-8" style={{ color: "hsl(220, 10%, 50%)" }}>
            Введите данные для доступа к панели управления
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider"
                style={{ color: "hsl(220, 10%, 55%)" }}>
                Email / Логин
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.ru"
                className="w-full rounded-md px-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  background: "hsl(220, 25%, 16%)",
                  border: "1px solid hsl(220, 25%, 24%)",
                  color: "white",
                }}
                onFocus={(e) => e.target.style.borderColor = "hsl(142, 72%, 29%)"}
                onBlur={(e) => e.target.style.borderColor = "hsl(220, 25%, 24%)"}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider"
                style={{ color: "hsl(220, 10%, 55%)" }}>
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md px-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  background: "hsl(220, 25%, 16%)",
                  border: "1px solid hsl(220, 25%, 24%)",
                  color: "white",
                }}
                onFocus={(e) => e.target.style.borderColor = "hsl(142, 72%, 29%)"}
                onBlur={(e) => e.target.style.borderColor = "hsl(220, 25%, 24%)"}
              />
            </div>

            {error && (
              <div className="text-xs text-red-400 flex items-center gap-2">
                <Icon name="AlertCircle" size={12} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md py-2.5 text-sm font-medium text-white transition-all mt-2"
              style={{
                background: loading ? "hsl(142, 40%, 25%)" : "hsl(142, 72%, 29%)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => !loading && ((e.target as HTMLElement).style.background = "hsl(142, 72%, 24%)")}
              onMouseLeave={(e) => !loading && ((e.target as HTMLElement).style.background = "hsl(142, 72%, 29%)")}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Loader2" size={14} className="animate-spin" />
                  Вход...
                </span>
              ) : "Войти"}
            </button>
          </form>

          <p className="text-xs text-center mt-8" style={{ color: "hsl(220, 10%, 35%)" }}>
            Забыли пароль? Обратитесь к администратору
          </p>
        </div>
      </div>
    </div>
  );
}
