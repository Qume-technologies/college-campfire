import { useSyncExternalStore } from "react";
import * as S from "./mock-data";

/**
 * In-memory mock data layer. Shapes mirror the mobile app tables (profiles, attendance,
 * timetable, ...) plus SaaS tables, each tenant row carrying college_id.
 * Swap these hooks for Supabase queries when the backend is connected.
 */
type Row = { id: string } & Record<string, any>;
const db: Record<string, Row[]> = {
  colleges: S.SEED_COLLEGES, students: S.SEED_STUDENTS, employees: S.SEED_EMPLOYEES, roles: S.SEED_ROLES,
  departments: S.SEED_DEPARTMENTS, attendance: S.SEED_ATTENDANCE, timetable: S.SEED_TIMETABLE,
  assignments: S.SEED_ASSIGNMENTS, notices: S.SEED_NOTICES, notifications: S.SEED_NOTIFICATIONS,
  fees: S.SEED_FEES, exams: S.SEED_EXAMS, results: S.SEED_RESULTS, leaves: S.SEED_LEAVES,
  plans: S.SEED_PLANS, platform_users: S.SEED_PLATFORM_USERS, audit: S.SEED_AUDIT,
  sessions: S.SEED_SESSIONS, subjects: S.SEED_SUBJECTS, rooms: S.SEED_ROOMS,
};
export type CollectionKey = keyof typeof db & string;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };

let currentActor = { user: "System", college_id: null as string | null };
export const setActor = (a: typeof currentActor) => { currentActor = a; };

export function audit(action: string, module: string, record: string) {
  db.audit = [{ id: `aud-${Date.now()}`, user: currentActor.user, college_id: currentActor.college_id, action, module, record, created_at: new Date().toISOString().slice(0, 16).replace("T", " "), meta: "{}" }, ...db.audit];
}

export const dataApi = {
  get: <T = Row>(k: CollectionKey) => db[k] as unknown as T[],
  create(k: CollectionKey, row: Record<string, any>, module = k) {
    const r = { id: `${k}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, created_at: new Date().toISOString().slice(0, 10), ...row };
    db[k] = [r, ...db[k]]; audit("Created record", module, String(row.title ?? row.name ?? row.full_name ?? r.id)); emit(); return r;
  },
  update(k: CollectionKey, id: string, patch: Record<string, any>, module = k, action = "Updated record") {
    db[k] = db[k].map((r) => (r.id === id ? { ...r, ...patch } : r));
    const r = db[k].find((x) => x.id === id); audit(action, module, String(r?.title ?? r?.name ?? r?.full_name ?? id)); emit();
  },
  remove(k: CollectionKey, ids: string[], module = k) {
    db[k] = db[k].filter((r) => !ids.includes(r.id)); audit(`Deleted ${ids.length} record(s)`, module, ids.join(", ").slice(0, 40)); emit();
  },
  bulkCreate(k: CollectionKey, rows: Record<string, any>[], module = k) {
    db[k] = [...rows.map((row, i) => ({ id: `${k}-${Date.now()}-${i}`, ...row })), ...db[k]]; audit(`Imported ${rows.length} record(s)`, module, "CSV"); emit();
  },
};

export function useCollection<T = Row>(k: CollectionKey, collegeId?: string | null): T[] {
  const all = useSyncExternalStore(subscribe, () => db[k], () => db[k]);
  // Tenant isolation: college-scoped callers only ever see their own college's rows.
  return (collegeId ? all.filter((r) => r.college_id === collegeId) : all) as unknown as T[];
}
