import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {isLoggedIn ? (
        <Dashboard onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      )}
    </TooltipProvider>
  );
}
