import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import { SettingsProvider } from "@/context/SettingsContext";
import { AuthProvider } from "@/context/AuthContext";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthProvider>
      <SettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {isLoggedIn ? (
            <Dashboard onLogout={() => setIsLoggedIn(false)} />
          ) : (
            <LoginPage onLogin={() => setIsLoggedIn(true)} />
          )}
        </TooltipProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
