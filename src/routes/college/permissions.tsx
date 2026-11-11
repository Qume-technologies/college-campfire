import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, KeyRound, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/app/ui-bits";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dataApi, useCollection } from "@/lib/store";
import { PERMISSION_MODULES } from "@/lib/permissions";
import type { Role } from "@/lib/mock-data";

export const Route = createFileRoute("/college/permissions")({
  head: () => ({ meta: [
    { title: "Role permissions — CampusOS" },
    { name: "description", content: "Configure college role permissions by administration module." },
    { property: "og:title", content: "Role permissions — CampusOS" },
    { property: "og:description", content: "Dynamic college role permission editor." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: PermissionsPage,
});

function PermissionsPage() {
  const roles = useCollection<Role>("roles", "col-bwic");
  const [roleId, setRoleId] = useState("role-admin");
  const selected = roles.find((r) => r.id === roleId) ?? roles[0];
  const [draft, setDraft] = useState<string[]>(selected?.permissions ?? []);
  const [saved, setSaved] = useState(true);

  const chooseRole = (id: string) => { setRoleId(id); setDraft(roles.find((r) => r.id === id)?.permissions ?? []); setSaved(true); };
  const setPermission = (key: string, enabled: boolean) => { setDraft((old) => enabled ? [...new Set([...old, key])] : old.filter((p) => p !== key)); setSaved(false); };
  const setModule = (keys: string[], enabled: boolean) => { setDraft((old) => enabled ? [...new Set([...old, ...keys])] : old.filter((p) => !keys.includes(p))); setSaved(false); };
  const save = () => { if (!selected) return; dataApi.update("roles", selected.id, { permissions: draft }, "Permissions", "Updated role permissions"); setSaved(true); toast.success(`Permissions saved for ${selected.name}`); };

  if (!selected) return null;
  return (
    <div>
      <PageHeader title="Permissions" description="Choose a role and configure what its members can do. All modules remain open in this preview." actions={<><Button asChild variant="outline" size="sm"><Link to="/college/roles">Manage roles</Link></Button><Button size="sm" onClick={save} disabled={saved}><Save />{saved ? "Saved" : "Save changes"}</Button></>} />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Panel title="Role" description="Select the role to edit"><div className="p-4"><Select value={selected.id} onValueChange={chooseRole}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{roles.map((role) => <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>)}</SelectContent></Select><div className="mt-4 flex items-start gap-3 rounded-lg bg-muted/60 p-3"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" /><div><p className="text-sm font-medium">{selected.name}</p><p className="mt-1 text-xs text-muted-foreground">{selected.description}</p></div></div></div></Panel>
        <Panel title="Access summary" description="Current draft selection"><div className="flex h-[calc(100%-65px)] flex-col justify-center p-5"><p className="text-3xl font-semibold">{draft.length}</p><p className="mt-1 text-sm text-muted-foreground">permissions enabled</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, (draft.length / 50) * 100)}%` }} /></div><p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><KeyRound className="size-3.5" />Changes apply when you save.</p></div></Panel>
        <Panel title="Bulk selection" description="Apply a starting point quickly"><div className="grid gap-2 p-4"><Button variant="outline" onClick={() => { setDraft(PERMISSION_MODULES.flatMap((m) => m.permissions.map((p) => p.key))); setSaved(false); }}><Check />Enable all permissions</Button><Button variant="outline" onClick={() => { setDraft([]); setSaved(false); }}>Clear all permissions</Button></div></Panel>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">{PERMISSION_MODULES.map((module) => {
        const keys = module.permissions.map((p) => p.key);
        const enabled = keys.filter((key) => draft.includes(key)).length;
        return <Panel key={module.key} title={module.label} description={`${enabled} of ${keys.length} enabled`} actions={<Checkbox aria-label={`Toggle all ${module.label} permissions`} checked={enabled === keys.length} onCheckedChange={(checked) => setModule(keys, !!checked)} />}><ul className="divide-y">{module.permissions.map((permission) => <li key={permission.key}><label className="flex cursor-pointer items-center gap-3 px-5 py-3 hover:bg-muted/40"><Checkbox checked={draft.includes(permission.key)} onCheckedChange={(checked) => setPermission(permission.key, !!checked)} /><span className="min-w-0 flex-1"><span className="block text-sm">{permission.label}</span><span className="mt-0.5 block text-[11px] text-muted-foreground">{permission.key}</span></span></label></li>)}</ul></Panel>;
      })}</div>
    </div>
  );
}
