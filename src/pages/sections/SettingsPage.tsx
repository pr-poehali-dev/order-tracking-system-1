import { useState } from "react";
import Icon from "@/components/ui/icon";

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("ООО «МеталлоТорг»");
  const [timezone, setTimezone] = useState("Europe/Moscow");
  const [emailNotif, setEmailNotif] = useState(true);
  const [autoExport, setAutoExport] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5 max-w-2xl animate-fade-in">
      {/* Company */}
      <Section title="Организация" icon="Building2">
        <Field label="Название компании">
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-md px-3 py-2 text-sm outline-none transition-all"
            style={{ border: "1px solid hsl(220, 15%, 86%)", color: "hsl(220, 25%, 12%)" }}
            onFocus={(e) => (e.target.style.borderColor = "hsl(142, 72%, 35%)")}
            onBlur={(e) => (e.target.style.borderColor = "hsl(220, 15%, 86%)")}
          />
        </Field>
        <Field label="Часовой пояс">
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full rounded-md px-3 py-2 text-sm outline-none"
            style={{ border: "1px solid hsl(220, 15%, 86%)", color: "hsl(220, 25%, 12%)" }}
          >
            <option value="Europe/Moscow">Москва (UTC+3)</option>
            <option value="Europe/Kaliningrad">Калининград (UTC+2)</option>
            <option value="Asia/Yekaterinburg">Екатеринбург (UTC+5)</option>
            <option value="Asia/Novosibirsk">Новосибирск (UTC+7)</option>
          </select>
        </Field>
      </Section>

      {/* Notifications */}
      <Section title="Уведомления" icon="Bell">
        <Toggle
          label="Email-уведомления по заказам"
          description="Получать письмо при изменении статуса заказа"
          value={emailNotif}
          onChange={setEmailNotif}
        />
        <Toggle
          label="Автоматическая выгрузка отчётов"
          description="Еженедельно отправлять Excel-отчёт на почту"
          value={autoExport}
          onChange={setAutoExport}
        />
      </Section>

      {/* Security */}
      <Section title="Безопасность" icon="Shield">
        <div className="flex items-center justify-between py-1">
          <div>
            <div className="text-sm font-medium" style={{ color: "hsl(220, 25%, 12%)" }}>Пароль</div>
            <div className="text-xs mt-0.5" style={{ color: "hsl(220, 10%, 55%)" }}>
              Последнее изменение: 15 марта 2026
            </div>
          </div>
          <button
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={{
              border: "1px solid hsl(220, 15%, 85%)",
              color: "hsl(220, 25%, 20%)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(220, 15%, 96%)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Сменить пароль
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <div>
            <div className="text-sm font-medium" style={{ color: "hsl(220, 25%, 12%)" }}>Сессии</div>
            <div className="text-xs mt-0.5" style={{ color: "hsl(220, 10%, 55%)" }}>1 активная сессия</div>
          </div>
          <button
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={{
              border: "1px solid hsl(0, 60%, 88%)",
              color: "hsl(0, 65%, 45%)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(0, 60%, 97%)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Завершить все
          </button>
        </div>
      </Section>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-white transition-all"
          style={{ background: "hsl(142, 72%, 29%)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(142, 72%, 24%)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(142, 72%, 29%)")}
        >
          <Icon name="Save" size={14} />
          Сохранить изменения
        </button>
        {saved && (
          <div className="flex items-center gap-2 text-sm animate-fade-in" style={{ color: "hsl(142, 65%, 35%)" }}>
            <Icon name="CheckCircle2" size={14} />
            Сохранено
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: "white", border: "1px solid hsl(220, 15%, 88%)" }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-4"
        style={{ borderBottom: "1px solid hsl(220, 15%, 92%)" }}
      >
        <Icon name={icon as "Building2"} size={15} className="text-green-700" />
        <h3 className="font-semibold text-sm" style={{ color: "hsl(220, 25%, 12%)" }}>{title}</h3>
      </div>
      <div className="px-5 py-4 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
        style={{ color: "hsl(220, 10%, 50%)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({ label, description, value, onChange }: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium" style={{ color: "hsl(220, 25%, 12%)" }}>{label}</div>
        <div className="text-xs mt-0.5" style={{ color: "hsl(220, 10%, 55%)" }}>{description}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className="relative w-10 h-5 rounded-full transition-all flex-shrink-0"
        style={{ background: value ? "hsl(142, 72%, 35%)" : "hsl(220, 15%, 82%)" }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
          style={{ left: value ? "calc(100% - 18px)" : "2px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
        />
      </button>
    </div>
  );
}
