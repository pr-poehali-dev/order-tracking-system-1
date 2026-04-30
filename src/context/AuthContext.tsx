import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "marketer" | "production";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  currentUser: CurrentUser;
  setCurrentUser: (u: CurrentUser) => void;
}

const AuthContext = createContext<AuthContextValue>({
  currentUser: { id: "USR-001", name: "Администратор", email: "admin@company.ru", role: "admin" },
  setCurrentUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    id: "USR-001",
    name: "Администратор",
    email: "admin@company.ru",
    role: "admin",
  });

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
