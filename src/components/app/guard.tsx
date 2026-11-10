import type { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { useSession } from "@/lib/auth";

export function RequireSession({ kind, children }: { kind: "super_admin" | "college"; children: ReactNode }) {
  const s = useSession();
  if (!s) return <Navigate to="/login" />;
  if (s.kind !== kind) return <Navigate to={s.kind === "super_admin" ? "/super-admin/dashboard" : "/college/dashboard"} />;
  return <>{children}</>;
}
