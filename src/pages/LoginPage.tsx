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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "hsl(220, 20%, 94%)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 animate-fade-in"
        style={{
          background: "white",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
        }}
      >
        {/* Icon */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "hsl(142, 65%, 45%)" }}
          >
            <Icon name="TrendingUp" size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-center" style={{ color: "hsl(220, 25%, 12%)" }}>
            Заказы ОАО «Поставымебель»
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(142, 55%, 42%)" }}>
            Войдите в систему
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "hsl(220, 20%, 20%)" }}>
              Логин
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите логин"
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
              style={{
                border: "1.5px solid hsl(220, 15%, 86%)",
                color: "hsl(220, 25%, 12%)",
                background: "white",
              }}
              onFocus={(e) => (e.target.style.borderColor = "hsl(142, 65%, 45%)")}
              onBlur={(e) => (e.target.style.borderColor = "hsl(220, 15%, 86%)")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "hsl(220, 20%, 20%)" }}>
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
              style={{
                border: "1.5px solid hsl(220, 15%, 86%)",
                color: "hsl(220, 25%, 12%)",
                background: "white",
              }}
              onFocus={(e) => (e.target.style.borderColor = "hsl(142, 65%, 45%)")}
              onBlur={(e) => (e.target.style.borderColor = "hsl(220, 15%, 86%)")}
            />
          </div>

          {error && (
            <div className="text-xs flex items-center gap-1.5" style={{ color: "hsl(0, 65%, 50%)" }}>
              <Icon name="AlertCircle" size={12} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-3 text-sm font-semibold text-white transition-all mt-1"
            style={{
              background: loading ? "hsl(142, 55%, 52%)" : "hsl(142, 65%, 45%)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => !loading && ((e.currentTarget.style.background = "hsl(142, 65%, 38%)"))}
            onMouseLeave={(e) => !loading && ((e.currentTarget.style.background = "hsl(142, 65%, 45%)"))}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Icon name="Loader2" size={14} className="animate-spin" />
                Вход...
              </span>
            ) : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
