import { createContext, useContext, useState, ReactNode } from "react";
import { OrderType, initialOrderTypes } from "@/data/mockData";

interface OrderTypesContextValue {
  orderTypes: OrderType[];
  setOrderTypes: (types: OrderType[]) => void;
}

const OrderTypesContext = createContext<OrderTypesContextValue>({
  orderTypes: initialOrderTypes,
  setOrderTypes: () => {},
});

export function OrderTypesProvider({ children }: { children: ReactNode }) {
  const [orderTypes, setOrderTypes] = useState<OrderType[]>(initialOrderTypes);
  return (
    <OrderTypesContext.Provider value={{ orderTypes, setOrderTypes }}>
      {children}
    </OrderTypesContext.Provider>
  );
}

export function useOrderTypes() {
  return useContext(OrderTypesContext);
}
