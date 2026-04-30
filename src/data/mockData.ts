import type { UserRole } from "@/context/AuthContext";

export interface OrderType {
  id: string;
  name: string;
  color: string;
}

export interface OrderPosition {
  id: string;
  name: string;
  quantity: string;
  price: string;
  amount: string;
  priceUnknown: boolean;
  amountUnknown: boolean;
  notes: string;
}

export type OrderStatus = "new" | "processing" | "assembly" | "completed" | "cancelled";

export interface Order {
  id: string;
  contractNumber: string;
  client: string;
  phone: string;
  region: string;
  city: string;
  address: string;
  positions: OrderPosition[];
  agreementDate: string;
  deliveryDate: string;
  amount: number;
  status: OrderStatus;
  date: string;
  manager: string;
  orderTypeId?: string;
}

export interface AppUser {
  id: string;
  name: string;
  login: string;
  password: string;
  role: UserRole;
  status: "active" | "inactive";
  lastLogin: string;
  ordersCount: number;
}

export const REGIONS: Record<string, string[]> = {
  "Брестская": ["Брест", "Барановичи", "Пинск", "Кобрин", "Берёза", "Иваново", "Лунинец", "Пружаны", "Столин", "Дрогичин", "Жабинка", "Ивацевичи", "Каменец", "Микашевичи"],
  "Витебская": ["Витебск", "Орша", "Полоцк", "Новополоцк", "Глубокое", "Лепель", "Миоры", "Поставы", "Сенно", "Толочин", "Городок", "Браслав", "Дубровно", "Верхнедвинск"],
  "Гомельская": ["Гомель", "Жлобин", "Мозырь", "Светлогорск", "Речица", "Калинковичи", "Петриков", "Добруш", "Рогачёв", "Ветка", "Житковичи", "Наровля", "Хойники", "Чечерск"],
  "Гродненская": ["Гродно", "Лида", "Слоним", "Волковыск", "Новогрудок", "Сморгонь", "Берёзовка", "Дятлово", "Зельва", "Ивье", "Мосты", "Островец", "Ошмяны", "Щучин"],
  "Минская": ["Минск", "Борисов", "Солигорск", "Молодечно", "Жодино", "Слуцк", "Вилейка", "Дзержинск", "Заславль", "Клецк", "Копыль", "Логойск", "Марьина Горка", "Несвиж", "Смолевичи", "Старые Дороги", "Столбцы", "Узда", "Червень"],
  "Могилёвская": ["Могилёв", "Бобруйск", "Горки", "Осиповичи", "Кричев", "Климовичи", "Костюковичи", "Кировск", "Мстиславль", "Шклов", "Белыничи", "Быхов", "Глуск", "Чаусы", "Чериков"],
};

export const ORDER_STATUSES: { value: OrderStatus; label: string; bg: string; text: string }[] = [
  { value: "new",        label: "Новый",              bg: "hsl(210, 80%, 93%)", text: "hsl(210, 72%, 35%)" },
  { value: "processing", label: "В работе",           bg: "hsl(38, 90%, 93%)",  text: "hsl(38, 72%, 35%)"  },
  { value: "assembly",   label: "Передан на сборку",  bg: "hsl(260, 70%, 93%)", text: "hsl(260, 60%, 40%)" },
  { value: "completed",  label: "Выполнен",           bg: "hsl(142, 60%, 92%)", text: "hsl(142, 65%, 28%)" },
  { value: "cancelled",  label: "Отменён",            bg: "hsl(0, 60%, 93%)",   text: "hsl(0, 65%, 40%)"   },
];

const newPosition = (n = 1): OrderPosition => ({
  id: String(Date.now() + n),
  name: "",
  quantity: "",
  price: "",
  amount: "",
  priceUnknown: false,
  amountUnknown: false,
  notes: "",
});

export { newPosition };

export const orders: Order[] = [
  {
    id: "ЗК-00124", contractNumber: "ДГ-2024/124", client: "ООО «Металлург»",
    phone: "+375 29 111-11-11", region: "Минская", city: "Минск", address: "ул. Ленина, 1",
    positions: [{ id: "1", name: "Арматура 12мм", quantity: "10", price: "18450", amount: "184500", priceUnknown: false, amountUnknown: false, notes: "" }],
    agreementDate: "2026-04-01", deliveryDate: "2026-04-28",
    amount: 184500, status: "completed", date: "2026-04-28", manager: "Козлов А.П."
  },
  {
    id: "ЗК-00123", contractNumber: "ДГ-2024/123", client: "ИП Сидоров В.Е.",
    phone: "+375 44 222-22-22", region: "Гомельская", city: "Гомель", address: "пр. Победы, 5",
    positions: [{ id: "2", name: "Трубы профильные", quantity: "5", price: "13440", amount: "67200", priceUnknown: false, amountUnknown: false, notes: "" }],
    agreementDate: "2026-04-05", deliveryDate: "2026-05-10",
    amount: 67200, status: "assembly", date: "2026-04-27", manager: "Иванова Н.С."
  },
  {
    id: "ЗК-00122", contractNumber: "ДГ-2024/122", client: "АО «СтройКомплект»",
    phone: "+375 29 333-33-33", region: "Витебская", city: "Витебск", address: "ул. Кирова, 12",
    positions: [{ id: "3", name: "Листовой металл", quantity: "20", price: "16000", amount: "320000", priceUnknown: false, amountUnknown: false, notes: "" }],
    agreementDate: "2026-04-10", deliveryDate: "2026-05-03",
    amount: 320000, status: "processing", date: "2026-04-26", manager: "Козлов А.П."
  },
  {
    id: "ЗК-00121", contractNumber: "ДГ-2024/121", client: "ООО «Промснаб»",
    phone: "+375 33 444-44-44", region: "Брестская", city: "Брест", address: "ул. Советская, 8",
    positions: [{ id: "4", name: "Уголок стальной", quantity: "8", price: "5725", amount: "45800", priceUnknown: false, amountUnknown: false, notes: "" }],
    agreementDate: "2026-04-12", deliveryDate: "2026-05-07",
    amount: 45800, status: "new", date: "2026-04-25", manager: "Петров И.В."
  },
];

export const users: AppUser[] = [
  { id: "USR-001", name: "Козлов Андрей Петрович",     login: "kozlov",    password: "Admin123",  role: "admin",      status: "active",   lastLogin: "2026-04-30 09:14", ordersCount: 48 },
  { id: "USR-002", name: "Иванова Надежда Сергеевна",  login: "ivanova",   password: "Pass456",   role: "marketer",   status: "active",   lastLogin: "2026-04-30 08:47", ordersCount: 34 },
  { id: "USR-003", name: "Петров Игорь Владимирович",  login: "petrov",    password: "Pass789",   role: "marketer",   status: "active",   lastLogin: "2026-04-29 17:22", ordersCount: 29 },
  { id: "USR-004", name: "Смирнова Елена Юрьевна",     login: "smirnova",  password: "Pass321",   role: "production", status: "inactive", lastLogin: "2026-04-15 11:05", ordersCount: 0  },
  { id: "USR-005", name: "Дмитриев Кирилл Олегович",   login: "dmitriev",  password: "Pass654",   role: "production", status: "active",   lastLogin: "2026-04-28 14:30", ordersCount: 0  },
];

export const initialOrderTypes: OrderType[] = [
  { id: "OT-001", name: "Розничный",    color: "#6366f1" },
  { id: "OT-002", name: "Оптовый",      color: "#f59e0b" },
  { id: "OT-003", name: "Корпоративный", color: "#10b981" },
];

export const statsCards = [
  { title: "Заказов за месяц", value: "124", change: "+12%", trend: "up", icon: "ShoppingCart" },
  { title: "Выручка, ₽",      value: "4 218 500", change: "+8.3%", trend: "up", icon: "TrendingUp" },
];