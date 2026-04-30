export interface Order {
  id: string;
  client: string;
  product: string;
  amount: number;
  status: "new" | "processing" | "shipped" | "completed" | "cancelled";
  date: string;
  manager: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "viewer";
  status: "active" | "inactive";
  lastLogin: string;
  ordersCount: number;
}

export const orders: Order[] = [
  { id: "ЗК-00124", client: "ООО «Металлург»", product: "Арматура 12мм", amount: 184500, status: "completed", date: "2026-04-28", manager: "Козлов А.П." },
  { id: "ЗК-00123", client: "ИП Сидоров В.Е.", product: "Трубы профильные", amount: 67200, status: "shipped", date: "2026-04-27", manager: "Иванова Н.С." },
  { id: "ЗК-00122", client: "АО «СтройКомплект»", product: "Листовой металл", amount: 320000, status: "processing", date: "2026-04-26", manager: "Козлов А.П." },
  { id: "ЗК-00121", client: "ООО «Промснаб»", product: "Уголок стальной", amount: 45800, status: "new", date: "2026-04-25", manager: "Петров И.В." },
  { id: "ЗК-00120", client: "ЗАО «ТехМонтаж»", product: "Швеллер 16П", amount: 128900, status: "completed", date: "2026-04-24", manager: "Иванова Н.С." },
  { id: "ЗК-00119", client: "ООО «ГорСтрой»", product: "Балка двутавровая", amount: 256000, status: "cancelled", date: "2026-04-23", manager: "Петров И.В." },
  { id: "ЗК-00118", client: "ИП Морозов К.А.", product: "Сетка сварная", amount: 33400, status: "completed", date: "2026-04-22", manager: "Козлов А.П." },
  { id: "ЗК-00117", client: "ООО «АльфаМет»", product: "Полоса стальная", amount: 91700, status: "shipped", date: "2026-04-21", manager: "Иванова Н.С." },
  { id: "ЗК-00116", client: "ОАО «Завод №1»", product: "Арматура 16мм", amount: 412000, status: "processing", date: "2026-04-20", manager: "Козлов А.П." },
  { id: "ЗК-00115", client: "ООО «БетонСтрой»", product: "Проволока вязальная", amount: 18900, status: "new", date: "2026-04-19", manager: "Петров И.В." },
  { id: "ЗК-00114", client: "ИП Белов Д.М.", product: "Трубы круглые", amount: 74500, status: "completed", date: "2026-04-18", manager: "Иванова Н.С." },
  { id: "ЗК-00113", client: "ООО «КровМонтаж»", product: "Профнастил", amount: 156000, status: "shipped", date: "2026-04-17", manager: "Козлов А.П." },
];

export const users: User[] = [
  { id: "USR-001", name: "Козлов Андрей Петрович", email: "kozlov@company.ru", role: "admin", status: "active", lastLogin: "2026-04-30 09:14", ordersCount: 48 },
  { id: "USR-002", name: "Иванова Надежда Сергеевна", email: "ivanova@company.ru", role: "manager", status: "active", lastLogin: "2026-04-30 08:47", ordersCount: 34 },
  { id: "USR-003", name: "Петров Игорь Владимирович", email: "petrov@company.ru", role: "manager", status: "active", lastLogin: "2026-04-29 17:22", ordersCount: 29 },
  { id: "USR-004", name: "Смирнова Елена Юрьевна", email: "smirnova@company.ru", role: "viewer", status: "inactive", lastLogin: "2026-04-15 11:05", ordersCount: 0 },
  { id: "USR-005", name: "Дмитриев Кирилл Олегович", email: "dmitriev@company.ru", role: "viewer", status: "active", lastLogin: "2026-04-28 14:30", ordersCount: 0 },
];

export const statsCards = [
  { title: "Заказов за месяц", value: "124", change: "+12%", trend: "up", icon: "ShoppingCart" },
  { title: "Выручка, ₽", value: "4 218 500", change: "+8.3%", trend: "up", icon: "TrendingUp" },
];