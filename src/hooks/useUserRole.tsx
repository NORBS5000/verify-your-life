import { useState } from "react";

// Simplified hook - admin check is now based on a simple PIN/password system
// Since we removed authentication, admin access can be controlled differently
export function useUserRole() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading] = useState(false);

  const checkAdminAccess = (pin: string) => {
    // Simple PIN-based admin access (you can change this PIN)
    if (pin === "admin1234") {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  return { isAdmin, loading, checkAdminAccess };
}
