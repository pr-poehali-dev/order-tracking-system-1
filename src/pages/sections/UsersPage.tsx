import { useState } from "react";
import Icon from "@/components/ui/icon";
import { users as initialUsers, AppUser } from "@/data/mockData";
import { useAuth, UserRole } from "@/context/AuthContext";

export const roleMap: Record<UserRole, { label: string; bg: string; text: string; icon: string; desc: string }> = {
  admin:      { label: "Администратор", bg: "hsl(220, 70%, 92%)", text: "hsl(220, 65%, 35%)", icon: "ShieldCheck",   desc: "Все права: управление пользователями, заказами и настройками" },
  marketer:   { label: "Маркетолог",    bg: "hsl(38, 85%, 92%)",  text: "hsl(38, 72%, 35%)",  icon: "Megaphone",     desc: "Добавление и редактирование заказов, типов заказов" },
  production: { label: "Производство",  bg: "hsl(142, 60%, 91%)", text: "hsl(142, 65%, 28%)", icon: "Factory",       desc: "Просмотр заказов, изменение статуса заказа" },
};

const emptyUser = (): Omit<AppUser, "id" | "lastLogin" | "ordersCount"> => ({
  name: "",
  login: "",
  password: "",
  role: "marketer",
  status: "active",
});

export default function UsersPage() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser.role === "admin";

  const [userList, setUserList] = useState<AppUser[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState<AppUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState(emptyUser());
  const [formError, setFormError] = useState("");

  const filtered = userList.filter((u) => {
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.login.toLowerCase().includes(q);
  });

  const openAdd = () => {
    setEditUser(null);
    setForm(emptyUser());
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (u: AppUser) => {
    setEditUser(u);
    setForm({ name: u.name, login: u.login, password: u.password, role: u.role, status: u.status });
    setFormError("");
    setFormOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { setFormError("Введите имя"); return; }
    if (!form.login.trim()) { setFormError("Введите логин"); return; }
    if (!form.password.trim()) { setFormError("Введите пароль"); return; }
    setFormError("");

    if (editUser) {
      setUserList((list) => list.map((u) => u.id === editUser.id ? { ...u, ...form } : u));
    } else {
      const newUser: AppUser = {
        id: `USR-${String(Date.now()).slice(-3)}`,
        ...form,
        lastLogin: "—",
        ordersCount: 0,
      };
      setUserList((list) => [newUser, ...list]);
    }
    setFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setUserList((list) => list.filter((u) => u.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Roles info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(Object.entries(roleMap) as [UserRole, typeof roleMap[UserRole]][]).map(([, r]) => (
          <div key={r.label} className="rounded-lg px-4 py-3 flex items-start gap-3"
            style={{ background: "white", border: "1px solid hsl(220, 15%, 88%)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: r.bg }}>
              <Icon name={r.icon as "ShieldCheck"} size={15} style={{ color: r.text }} />
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: "hsl(220,25%,12%)" }}>{r.label}</div>
              <div className="text-xs mt-0.5" style={{ color: "hsl(220,10%,50%)" }}>{r.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48 rounded-md px-3 py-2"
          style={{ background: "white", border: "1px solid hsl(220, 15%, 88%)" }}>
          <Icon name="Search" size={14} style={{ color: "hsl(220, 10%, 55%)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени или логину..."
            className="flex-1 outline-none text-sm bg-transparent"
            style={{ color: "hsl(220, 25%, 12%)" }}
          />
        </div>
        {isAdmin && (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white transition-all"
            style={{ background: "hsl(142, 65%, 30%)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(142, 65%, 24%)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(142, 65%, 30%)")}
          >
            <Icon name="UserPlus" size={14} />
            Добавить
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden"
        style={{ background: "white", border: "1px solid hsl(220, 15%, 88%)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "hsl(220, 20%, 98%)", borderBottom: "1px solid hsl(220, 15%, 90%)" }}>
              {["Пользователь", "Роль", "Статус", "Последний вход", ...(isAdmin ? [""] : [])].map((h) => (
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
                <tr key={user.id} className="row-hover"
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid hsl(220, 15%, 94%)" : "none" }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                        style={{ background: role.bg, color: role.text }}>
                        {user.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: "hsl(220, 25%, 12%)" }}>
                          {user.name}
                        </div>
                        <div className="text-xs font-mono" style={{ color: "hsl(220, 10%, 50%)" }}>
                          {user.login}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Icon name={role.icon as "ShieldCheck"} size={13} style={{ color: role.text }} />
                      <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium"
                        style={{ background: role.bg, color: role.text }}>
                        {role.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full"
                        style={{ background: isActive ? "hsl(142, 72%, 40%)" : "hsl(220, 10%, 65%)" }} />
                      <span className="text-xs"
                        style={{ color: isActive ? "hsl(142, 65%, 30%)" : "hsl(220, 10%, 50%)" }}>
                        {isActive ? "Активен" : "Неактивен"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-mono" style={{ color: "hsl(220, 10%, 50%)" }}>
                    {user.lastLogin}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(user)}
                          className="p-1.5 rounded transition-colors" title="Редактировать"
                          style={{ color: "hsl(220, 10%, 55%)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "hsl(220, 15%, 93%)"; e.currentTarget.style.color = "hsl(220, 25%, 20%)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "hsl(220, 10%, 55%)"; }}>
                          <Icon name="Pencil" size={13} />
                        </button>
                        <button onClick={() => setDeleteConfirm(user.id)}
                          className="p-1.5 rounded transition-colors" title="Удалить"
                          style={{ color: "hsl(220, 10%, 55%)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "hsl(0, 60%, 95%)"; e.currentTarget.style.color = "hsl(0, 65%, 45%)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "hsl(220, 10%, 55%)"; }}>
                          <Icon name="Trash2" size={13} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-5 py-3 text-xs"
          style={{ borderTop: "1px solid hsl(220, 15%, 92%)", background: "hsl(220, 20%, 98%)", color: "hsl(220, 10%, 55%)" }}>
          Всего: <strong>{filtered.length}</strong> пользователей
        </div>
      </div>

      {/* User form modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={(e) => e.target === e.currentTarget && setFormOpen(false)}>
          <div className="w-full max-w-sm rounded-xl animate-fade-in"
            style={{ background: "white", boxShadow: "0 16px 48px rgba(0,0,0,0.18)" }}>
            <div className="flex items-center justify-between px-6 py-4 rounded-t-xl"
              style={{ borderBottom: "2px solid hsl(142, 65%, 40%)" }}>
              <h2 className="font-bold text-base" style={{ color: "hsl(142, 65%, 28%)" }}>
                {editUser ? "Редактировать пользователя" : "Новый пользователь"}
              </h2>
              <button onClick={() => setFormOpen(false)}
                className="p-1 rounded" style={{ color: "hsl(220, 10%, 55%)" }}>
                <Icon name="X" size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <FormField label="ФИО">
                <input type="text" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Иванов Иван Иванович"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: "1px solid hsl(220,15%,84%)", color: "hsl(220,25%,12%)" }}
                  onFocus={(e) => (e.target.style.borderColor = "hsl(142,65%,40%)")}
                  onBlur={(e) => (e.target.style.borderColor = "hsl(220,15%,84%)")} />
              </FormField>

              <FormField label="Логин">
                <input type="text" value={form.login}
                  onChange={(e) => setForm({ ...form, login: e.target.value })}
                  placeholder="ivanov"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none font-mono"
                  style={{ border: "1px solid hsl(220,15%,84%)", color: "hsl(220,25%,12%)" }}
                  onFocus={(e) => (e.target.style.borderColor = "hsl(142,65%,40%)")}
                  onBlur={(e) => (e.target.style.borderColor = "hsl(220,15%,84%)")} />
              </FormField>

              <FormField label="Пароль">
                <input type="text" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Введите пароль"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: "1px solid hsl(220,15%,84%)", color: "hsl(220,25%,12%)" }}
                  onFocus={(e) => (e.target.style.borderColor = "hsl(142,65%,40%)")}
                  onBlur={(e) => (e.target.style.borderColor = "hsl(220,15%,84%)")} />
              </FormField>

              <FormField label="Роль">
                <div className="space-y-2">
                  {(Object.entries(roleMap) as [UserRole, typeof roleMap[UserRole]][]).map(([key, r]) => (
                    <label key={key}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all"
                      style={{
                        border: form.role === key ? `2px solid ${r.text}` : "1px solid hsl(220,15%,88%)",
                        background: form.role === key ? r.bg : "white",
                      }}>
                      <input type="radio" name="role" value={key}
                        checked={form.role === key}
                        onChange={() => setForm({ ...form, role: key })}
                        className="accent-green-700" />
                      <Icon name={r.icon as "ShieldCheck"} size={14} style={{ color: r.text }} />
                      <div>
                        <div className="text-sm font-medium" style={{ color: "hsl(220,25%,12%)" }}>{r.label}</div>
                        <div className="text-xs" style={{ color: "hsl(220,10%,50%)" }}>{r.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </FormField>

              <FormField label="Статус">
                <div className="flex gap-3">
                  {(["active", "inactive"] as const).map((s) => (
                    <label key={s}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer flex-1 justify-center"
                      style={{
                        border: form.status === s ? "2px solid hsl(142,65%,40%)" : "1px solid hsl(220,15%,88%)",
                        background: form.status === s ? "hsl(142,60%,92%)" : "white",
                      }}>
                      <input type="radio" name="status" value={s}
                        checked={form.status === s}
                        onChange={() => setForm({ ...form, status: s })}
                        className="accent-green-700" />
                      <span className="text-sm" style={{ color: "hsl(220,25%,12%)" }}>
                        {s === "active" ? "Активен" : "Неактивен"}
                      </span>
                    </label>
                  ))}
                </div>
              </FormField>

              {formError && (
                <div className="text-xs flex items-center gap-1.5" style={{ color: "hsl(0,65%,50%)" }}>
                  <Icon name="AlertCircle" size={12} />
                  {formError}
                </div>
              )}

              <button onClick={handleSave}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
                style={{ background: "hsl(142, 65%, 30%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(142, 65%, 24%)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(142, 65%, 30%)")}>
                {editUser ? "Сохранить" : "Добавить пользователя"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="w-full max-w-sm rounded-xl p-6 animate-fade-in"
            style={{ background: "white", boxShadow: "0 16px 48px rgba(0,0,0,0.18)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "hsl(0,60%,95%)" }}>
                <Icon name="Trash2" size={18} style={{ color: "hsl(0,65%,45%)" }} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: "hsl(220,25%,12%)" }}>Удалить пользователя?</div>
                <div className="text-xs mt-0.5" style={{ color: "hsl(220,10%,50%)" }}>Это действие нельзя отменить</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ border: "1px solid hsl(220,15%,85%)", color: "hsl(220,25%,20%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(220,15%,96%)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                Отмена
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: "hsl(0,65%,48%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(0,65%,40%)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(0,65%,48%)")}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "hsl(220,20%,20%)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}