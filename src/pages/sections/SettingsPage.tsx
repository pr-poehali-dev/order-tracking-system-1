import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useSettings, HighlightRule } from "@/context/SettingsContext";

const PRESET_COLORS = [
  "#fef08a", "#fde68a", "#fca5a5", "#f9a8d4",
  "#86efac", "#6ee7b7", "#93c5fd", "#c4b5fd",
  "#fb923c", "#e2e8f0",
];

export default function SettingsPage() {
  const { rules, setRules } = useSettings();
  const [saved, setSaved] = useState(false);

  const addRule = () => {
    const newRule: HighlightRule = {
      id: String(Date.now()),
      days: 7,
      color: "#fef08a",
      label: "",
    };
    setRules([...rules, newRule]);
  };

  const updateRule = (id: string, key: keyof HighlightRule, value: string | number) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  };

  const removeRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-xl animate-fade-in space-y-5">
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "white", border: "1px solid hsl(220, 15%, 88%)" }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-2.5 px-5 py-4"
          style={{ borderBottom: "1px solid hsl(220, 15%, 92%)" }}
        >
          <Icon name="Paintbrush" size={15} className="text-green-700" />
          <h3 className="font-semibold text-sm" style={{ color: "hsl(220, 25%, 12%)" }}>
            Подсветка заказов на главной
          </h3>
        </div>

        <div className="px-5 py-4 space-y-3">
          <p className="text-xs" style={{ color: "hsl(220, 10%, 50%)" }}>
            Строки в таблице заказов будут закрашиваться, если до даты поставки осталось не более указанного числа дней.
          </p>

          {rules.length === 0 && (
            <div className="py-6 text-center text-sm" style={{ color: "hsl(220, 10%, 60%)" }}>
              Правила не добавлены
            </div>
          )}

          {rules.map((rule, idx) => (
            <div
              key={rule.id}
              className="rounded-lg p-4 space-y-3"
              style={{ background: "hsl(220, 20%, 98%)", border: "1px solid hsl(220, 15%, 90%)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "hsl(220, 10%, 50%)" }}>
                  Правило {idx + 1}
                </span>
                <button
                  onClick={() => removeRule(rule.id)}
                  className="p-1 rounded transition-colors"
                  style={{ color: "hsl(0, 60%, 60%)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(0, 60%, 95%)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <Icon name="Trash2" size={13} />
                </button>
              </div>

              {/* Days */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium whitespace-nowrap"
                  style={{ color: "hsl(220, 20%, 20%)" }}>
                  За
                </label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={rule.days}
                  onChange={(e) => updateRule(rule.id, "days", Number(e.target.value))}
                  className="w-20 rounded-lg px-3 py-2 text-sm outline-none text-center font-mono"
                  style={{ border: "1px solid hsl(220, 15%, 84%)", background: "white", color: "hsl(220,25%,12%)" }}
                  onFocus={(e) => (e.target.style.borderColor = "hsl(142, 65%, 40%)")}
                  onBlur={(e) => (e.target.style.borderColor = "hsl(220, 15%, 84%)")}
                />
                <label className="text-sm font-medium whitespace-nowrap"
                  style={{ color: "hsl(220, 20%, 20%)" }}>
                  дн. до поставки
                </label>
              </div>

              {/* Label */}
              <div>
                <label className="block text-xs font-medium mb-1.5"
                  style={{ color: "hsl(220, 15%, 45%)" }}>
                  Подпись (необязательно)
                </label>
                <input
                  type="text"
                  value={rule.label}
                  onChange={(e) => updateRule(rule.id, "label", e.target.value)}
                  placeholder="напр. Срочно"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: "1px solid hsl(220, 15%, 84%)", background: "white", color: "hsl(220,25%,12%)" }}
                  onFocus={(e) => (e.target.style.borderColor = "hsl(142, 65%, 40%)")}
                  onBlur={(e) => (e.target.style.borderColor = "hsl(220, 15%, 84%)")}
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-medium mb-2"
                  style={{ color: "hsl(220, 15%, 45%)" }}>
                  Цвет строки
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateRule(rule.id, "color", c)}
                      className="w-7 h-7 rounded-md transition-all"
                      style={{
                        background: c,
                        border: rule.color === c
                          ? "2.5px solid hsl(142, 65%, 35%)"
                          : "1.5px solid hsl(220, 15%, 82%)",
                        transform: rule.color === c ? "scale(1.15)" : "scale(1)",
                      }}
                      title={c}
                    />
                  ))}
                  {/* Custom color picker */}
                  <label className="relative w-7 h-7 rounded-md overflow-hidden cursor-pointer"
                    style={{ border: "1.5px solid hsl(220, 15%, 82%)" }}
                    title="Свой цвет">
                    <div className="w-full h-full flex items-center justify-center text-xs"
                      style={{ background: "white", color: "hsl(220,10%,55%)" }}>
                      <Icon name="Pipette" size={12} />
                    </div>
                    <input
                      type="color"
                      value={rule.color}
                      onChange={(e) => updateRule(rule.id, "color", e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </label>

                  {/* Preview */}
                  <div
                    className="ml-2 px-3 py-1 rounded text-xs font-medium"
                    style={{ background: rule.color, color: "hsl(220,25%,15%)", border: "1px solid hsl(220,15%,82%)" }}
                  >
                    Пример строки
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addRule}
            className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors w-full justify-center"
            style={{ color: "hsl(142, 65%, 30%)", border: "1px dashed hsl(142, 50%, 60%)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(142, 60%, 96%)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Icon name="Plus" size={14} />
            Добавить правило
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
          style={{ background: "hsl(142, 65%, 30%)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(142, 65%, 24%)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(142, 65%, 30%)")}
        >
          <Icon name="Save" size={14} />
          Сохранить
        </button>
        {saved && (
          <div className="flex items-center gap-2 text-sm animate-fade-in"
            style={{ color: "hsl(142, 65%, 35%)" }}>
            <Icon name="CheckCircle2" size={14} />
            Сохранено
          </div>
        )}
      </div>
    </div>
  );
}
