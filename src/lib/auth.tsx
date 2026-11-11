import { useSyncExternalStore } from "react";
import { dataApi, setActor, audit, useCollection } from "./store";
import type { Role } from "./mock-data";
import { ALL_PERMISSIONS } from "./permissions";

export type Session = { kind: "super_admin" | "college"; name: string; email: string; title: string; college_id: string | null; employee_id?: string; role_names: string[] };

export const DEMO_ACCOUNTS: (Session & { password: string })[] = [
  { kind: "super_admin", name: "Platform Owner", email: "owner@campusos.app", title: "Super Admin", college_id: null, role_names: [], password: "demo1234" },
  { kind: "college", name: "Anita Shrestha", email: "admin@bridgewater.edu.np", title: "College Administrator", college_id: "col-bwic", role_names: ["College Administrator"], password: "demo1234" },
  { kind: "college", name: "Prof. Rajan Thapa", email: "rajan.t@bwic.edu.np", title: "Teacher", college_id: "col-bwic", role_names: ["Teacher"], password: "demo1234" },
  { kind: "college", name: "Ramesh Karki", email: "ramesh@bwic.edu.np", title: "Accountant", college_id: "col-bwic", role_names: ["Accountant"], password: "demo1234" },
];

const KEY = "campusos.session";
let session: Session | null = typeof window !== "undefined" ? JSON.parse(window.sessionStorage.getItem(KEY) || "null") : null;
if (session) setActor({ user: session.name, college_id: session.college_id });
const ls = new Set<() => void>();
const set = (s: Session | null) => {
  session = s; if (typeof window !== "undefined") s ? sessionStorage.setItem(KEY, JSON.stringify(s)) : sessionStorage.removeItem(KEY);
  setActor({ user: s?.name ?? "System", college_id: s?.college_id ?? null }); ls.forEach((l) => l());
};

export function signIn(email: string, password: string): { ok: true; session: Session } | { ok: false; error: string } {
  const acc = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
  if (!acc || acc.password !== password) return { ok: false, error: "Invalid email or password." };
  if (acc.college_id) {
    const c = dataApi.get<any>("colleges").find((x) => x.id === acc.college_id);
    if (c?.status !== "Approved") return { ok: false, error: `This college is ${c?.status?.toLowerCase()}. Access is disabled.` };
  }
  const { password: _p, ...s } = acc; set(s); audit("User login", "Auth", s.email); return { ok: true, session: s };
}
export const signOut = () => set(null);

export function previewSession(kind: Session["kind"]): Session {
  const account = DEMO_ACCOUNTS.find((a) => a.kind === kind)!;
  const { password: _password, ...preview } = account;
  return preview;
}

export function enterPreview(kind: Session["kind"]) {
  const preview = previewSession(kind);
  set(preview);
  audit("Opened preview workspace", "Auth", preview.email);
  return preview;
}

export function useSession() {
  return useSyncExternalStore((l) => { ls.add(l); return () => ls.delete(l); }, () => session, () => null);
}

export function usePermissions(): Set<string> {
  const s = useSession();
  const roles = useCollection<Role>("roles");
  if (!s) return new Set();
  if (s.kind === "super_admin") return new Set(ALL_PERMISSIONS);
  return new Set(roles.filter((r) => r.college_id === s.college_id && s.role_names.includes(r.name)).flatMap((r) => r.permissions));
}
// The frontend preview intentionally exposes every module without permission gates.
export function useCan() { return (_key?: string) => true; }
