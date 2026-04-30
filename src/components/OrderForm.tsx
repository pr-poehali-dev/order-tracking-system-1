import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Order, OrderPosition, REGIONS, newPosition } from "@/data/mockData";

interface Props {
  initial?: Order | null;
  onSave: (order: Order) => void;
  onCancel: () => void;
}

const emptyOrder = (): Omit<Order, "id" | "amount" | "status" | "date" | "manager"> => ({
  contractNumber: "",
  client: "",
  phone: "",
  region: "",
  city: "",
  address: "",
  positions: [newPosition(1)],
  agreementDate: "",
  deliveryDate: "",
});

export default function OrderForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<ReturnType<typeof emptyOrder>>(
    initial
      ? {
          contractNumber: initial.contractNumber,
          client: initial.client,
          phone: initial.phone,
          region: initial.region,
          city: initial.city,
          address: initial.address,
          positions: initial.positions,
          agreementDate: initial.agreementDate,
          deliveryDate: initial.deliveryDate,
        }
      : emptyOrder()
  );

  const cities = form.region ? REGIONS[form.region] ?? [] : [];

  const setField = (key: keyof typeof form, val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }));

  const setPosition = (idx: number, key: keyof OrderPosition, val: unknown) =>
    setForm((f) => ({
      ...f,
      positions: f.positions.map((p, i) => (i === idx ? { ...p, [key]: val } : p)),
    }));

  const addPosition = () =>
    setForm((f) => ({ ...f, positions: [...f.positions, newPosition(f.positions.length + 1)] }));

  const removePosition = (idx: number) =>
    setForm((f) => ({ ...f, positions: f.positions.filter((_, i) => i !== idx) }));

  const handleSave = () => {
    const totalAmount = form.positions.reduce((sum, p) => {
      const a = parseFloat(p.amount.replace(/\s/g, "").replace(",", ".")) || 0;
      return sum + a;
    }, 0);

    const order: Order = {
      id: initial?.id ?? `ЗК-${String(Date.now()).slice(-5)}`,
      contractNumber: form.contractNumber,
      client: form.client,
      phone: form.phone,
      region: form.region,
      city: form.city,
      address: form.address,
      positions: form.positions,
      agreementDate: form.agreementDate,
      deliveryDate: form.deliveryDate,
      amount: totalAmount,
      status: initial?.status ?? "new",
      date: initial?.date ?? new Date().toISOString().slice(0, 10),
      manager: initial?.manager ?? "Козлов А.П.",
    };
    onSave(order);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        className="w-full max-w-lg rounded-xl animate-fade-in"
        style={{ background: "white", boxShadow: "0 16px 48px rgba(0,0,0,0.18)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 rounded-t-xl"
          style={{ borderBottom: "2px solid hsl(142, 65%, 40%)" }}
        >
          <h2 className="font-bold text-base" style={{ color: "hsl(142, 65%, 28%)" }}>
            {initial ? "Редактировать заказ" : "Новый заказ"}
          </h2>
          <button onClick={onCancel} className="p-1 rounded transition-colors"
            style={{ color: "hsl(220, 10%, 55%)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(220, 25%, 15%)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(220, 10%, 55%)")}>
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Договор + Заказчик */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Номер договора">
              <Input value={form.contractNumber} onChange={(v) => setField("contractNumber", v)} placeholder="ДГ-2024/001" />
            </Field>
            <Field label="Заказчик">
              <Input value={form.client} onChange={(v) => setField("client", v)} placeholder="ООО «Название»" />
            </Field>
          </div>

          {/* Телефон */}
          <Field label="Телефон">
            <Input value={form.phone} onChange={(v) => setField("phone", v)} placeholder="+375 29 123-45-67" />
          </Field>

          {/* Область + Город */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Область">
              <select
                value={form.region}
                onChange={(e) => { setField("region", e.target.value); setField("city", ""); }}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: "1px solid hsl(220, 15%, 84%)", color: form.region ? "hsl(220,25%,12%)" : "hsl(220,10%,60%)" }}
              >
                <option value="">Выберите область</option>
                {Object.keys(REGIONS).map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Город">
              <select
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                disabled={!form.region}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none disabled:opacity-50"
                style={{ border: "1px solid hsl(220, 15%, 84%)", color: form.city ? "hsl(220,25%,12%)" : "hsl(220,10%,60%)" }}
              >
                <option value="">Сначала область</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          {/* Адрес */}
          <Field label="Адрес">
            <Input value={form.address} onChange={(v) => setField("address", v)} placeholder="ул. Ленина, 1" />
          </Field>

          {/* Позиции */}
          <div className="space-y-3">
            {form.positions.map((pos, idx) => (
              <div key={pos.id} className="rounded-lg p-4 relative"
                style={{ border: "1px solid hsl(220, 15%, 88%)", background: "hsl(220, 20%, 98%)" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "hsl(220, 10%, 50%)" }}>
                    Позиция {idx + 1}
                  </span>
                  {form.positions.length > 1 && (
                    <button onClick={() => removePosition(idx)}
                      className="p-1 rounded transition-colors"
                      style={{ color: "hsl(0, 65%, 55%)" }}>
                      <Icon name="Trash2" size={13} />
                    </button>
                  )}
                </div>

                <Field label="Наименование">
                  <textarea
                    value={pos.name}
                    onChange={(e) => setPosition(idx, "name", e.target.value)}
                    rows={2}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                    style={{ border: "1px solid hsl(220, 15%, 84%)", background: "white", color: "hsl(220,25%,12%)" }}
                  />
                </Field>

                <div className="grid grid-cols-3 gap-3 mt-3">
                  <Field label="Количество">
                    <Input value={pos.quantity} onChange={(v) => setPosition(idx, "quantity", v)} placeholder="0" />
                  </Field>
                  <div>
                    <label className="block text-xs font-medium mb-1.5"
                      style={{ color: "hsl(220, 15%, 45%)" }}>
                      Цена (без НДС, без трансп. расходов), бел. руб.
                    </label>
                    <Input
                      value={pos.priceUnknown ? "" : pos.price}
                      onChange={(v) => setPosition(idx, "price", v)}
                      placeholder="0.00"
                      disabled={pos.priceUnknown}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5"
                      style={{ color: "hsl(220, 15%, 45%)" }}>
                      Стоимость, бел. руб.
                    </label>
                    <Input
                      value={pos.amountUnknown ? "" : pos.amount}
                      onChange={(v) => setPosition(idx, "amount", v)}
                      placeholder="0.00"
                      disabled={pos.amountUnknown}
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-2">
                  <Checkbox
                    checked={pos.priceUnknown}
                    onChange={(v) => setPosition(idx, "priceUnknown", v)}
                    label="Не просчитано"
                  />
                  <Checkbox
                    checked={pos.amountUnknown}
                    onChange={(v) => setPosition(idx, "amountUnknown", v)}
                    label="Не просчитано"
                  />
                </div>

                <div className="mt-3">
                  <Field label="Примечания">
                    <textarea
                      value={pos.notes}
                      onChange={(e) => setPosition(idx, "notes", e.target.value)}
                      rows={2}
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                      style={{ border: "1px solid hsl(220, 15%, 84%)", background: "white", color: "hsl(220,25%,12%)" }}
                    />
                  </Field>
                </div>
              </div>
            ))}

            <button
              onClick={addPosition}
              className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors"
              style={{ color: "hsl(142, 65%, 30%)", border: "1px dashed hsl(142, 50%, 60%)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(142, 60%, 96%)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Icon name="Plus" size={14} />
              Добавить позицию
            </button>
          </div>

          {/* Даты */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Дата соглашения">
              <input
                type="date"
                value={form.agreementDate}
                onChange={(e) => setField("agreementDate", e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: "1px solid hsl(220, 15%, 84%)", color: "hsl(220,25%,12%)" }}
              />
            </Field>
            <Field label="Дата поставки">
              <input
                type="date"
                value={form.deliveryDate}
                onChange={(e) => setField("deliveryDate", e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: "1px solid hsl(220, 15%, 84%)", color: "hsl(220,25%,12%)" }}
              />
            </Field>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all"
            style={{ background: "hsl(142, 65%, 30%)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(142, 65%, 24%)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(142, 65%, 30%)")}
          >
            Сохранить заказ
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "hsl(220, 20%, 20%)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, disabled }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-all disabled:opacity-40"
      style={{ border: "1px solid hsl(220, 15%, 84%)", background: "white", color: "hsl(220,25%,12%)" }}
      onFocus={(e) => (e.target.style.borderColor = "hsl(142, 65%, 40%)")}
      onBlur={(e) => (e.target.style.borderColor = "hsl(220, 15%, 84%)")}
    />
  );
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer text-xs"
      style={{ color: "hsl(220, 10%, 45%)" }}>
      <div
        onClick={() => onChange(!checked)}
        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
        style={{
          border: `1.5px solid ${checked ? "hsl(142, 65%, 40%)" : "hsl(220, 15%, 75%)"}`,
          background: checked ? "hsl(142, 65%, 40%)" : "white",
        }}
      >
        {checked && <Icon name="Check" size={10} className="text-white" />}
      </div>
      {label}
    </label>
  );
}
