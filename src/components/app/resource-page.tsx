import { useMemo, useRef, useState, type ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowUpDown, Download, MoreHorizontal, Pencil, Plus, Search, Trash2, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, dataApi, type CollectionKey } from "@/lib/store";
import { useSession, useCan } from "@/lib/auth";
import { toCSV, downloadCSV, parseCSV } from "@/lib/csv";
import { EmptyState, NoAccess, PageHeader } from "./ui-bits";
import { cn } from "@/lib/utils";

export type Field = { name: string; label: string; type?: "text" | "email" | "number" | "date" | "select" | "textarea" | "switch" | "time"; options?: string[]; required?: boolean; placeholder?: string; full?: boolean; min?: number; max?: number };
export type Column<T> = { key: string; label: string; render?: (row: T) => ReactNode; className?: string; sortable?: boolean; hideOnMobile?: boolean };
export type RowAction<T> = { label: string; icon?: any; perm?: string; onClick: (row: T) => void; hidden?: (row: T) => boolean };

type Props<T> = {
  title: string; description: string; collection: CollectionKey; module: string; scoped?: boolean; singular?: string;
  columns: Column<T>[]; fields?: Field[]; filters?: { key: string; label: string; options: string[] }[];
  searchKeys: string[]; perms?: { view?: string; create?: string; edit?: string; delete?: string; export?: string; import?: string };
  rowActions?: RowAction<T>[]; defaults?: Record<string, any>; headerExtra?: ReactNode; above?: ReactNode; pageSize?: number;
  transform?: (v: Record<string, any>) => Record<string, any>; rows?: T[]; filterRows?: (row: T) => boolean;
};

export function buildSchema(fields: Field[]) {
  return z.object(Object.fromEntries(fields.map((f) => {
    let s: z.ZodTypeAny;
    if (f.type === "number") { let n = z.coerce.number({ invalid_type_error: "Must be a number" }); if (f.min !== undefined) n = n.min(f.min); if (f.max !== undefined) n = n.max(f.max); s = n; }
    else if (f.type === "switch") s = z.boolean();
    else if (f.type === "email") s = f.required ? z.string().trim().email("Enter a valid email").max(255) : z.string().trim().email().or(z.literal(""));
    else { const t = z.string().trim().max(f.type === "textarea" ? 2000 : 200); s = f.required ? t.min(1, `${f.label} is required`) : t; }
    return [f.name, s];
  })));
}

export function RecordForm({ fields, defaults, onSubmit, onCancel, submitLabel }: { fields: Field[]; defaults: Record<string, any>; onSubmit: (v: any) => void; onCancel: () => void; submitLabel: string }) {
  const form = useForm({ resolver: zodResolver(buildSchema(fields)), defaultValues: Object.fromEntries(fields.map((f) => [f.name, defaults[f.name] ?? (f.type === "switch" ? false : "")])) });
  const err = form.formState.errors as Record<string, any>;
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={cn("space-y-1.5", (f.full || f.type === "textarea") && "sm:col-span-2")}>
            <Label htmlFor={f.name} className="text-xs font-medium">{f.label}{f.required && <span className="text-destructive"> *</span>}</Label>
            {f.type === "select" ? (
              <Controller control={form.control} name={f.name} render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange}>
                  <SelectTrigger id={f.name} className="w-full"><SelectValue placeholder={f.placeholder ?? "Select…"} /></SelectTrigger>
                  <SelectContent>{f.options!.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>)} />
            ) : f.type === "switch" ? (
              <Controller control={form.control} name={f.name} render={({ field }) => <div className="pt-1"><Switch id={f.name} checked={!!field.value} onCheckedChange={field.onChange} /></div>} />
            ) : f.type === "textarea" ? (
              <Textarea id={f.name} rows={4} placeholder={f.placeholder} {...form.register(f.name)} />
            ) : (
              <Input id={f.name} type={f.type ?? "text"} placeholder={f.placeholder} {...form.register(f.name)} />
            )}
            {err[f.name] && <p className="text-xs text-destructive">{String(err[f.name].message)}</p>}
          </div>
        ))}
      </div>
      <DialogFooter><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit">{submitLabel}</Button></DialogFooter>
    </form>
  );
}

export function ResourcePage<T extends { id: string } & Record<string, any>>(p: Props<T>) {
  const session = useSession(); const can = useCan();
  const collegeId = p.scoped === false ? null : session?.college_id ?? "col-bwic";
  const source = useCollection<T>(p.collection, collegeId);
  const all = p.filterRows ? (p.rows ?? source).filter(p.filterRows) : p.rows ?? source;
  const [q, setQ] = useState(""); const [flt, setFlt] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [page, setPage] = useState(0); const [sel, setSel] = useState<string[]>([]);
  const [editing, setEditing] = useState<T | "new" | null>(null); const [deleting, setDeleting] = useState<string[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const size = p.pageSize ?? 10; const singular = p.singular ?? p.title.replace(/s$/, "");

  const rows = useMemo(() => {
    let r = all.filter((x) => (!q || p.searchKeys.some((k) => String(x[k] ?? "").toLowerCase().includes(q.toLowerCase()))) && Object.entries(flt).every(([k, v]) => !v || v === "all" || String(x[k]) === v));
    if (sort) r = [...r].sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : a[sort.key] < b[sort.key] ? -1 : 0) * sort.dir);
    return r;
  }, [all, q, flt, sort, p.searchKeys]);
  const pages = Math.max(1, Math.ceil(rows.length / size)); const view = rows.slice(page * size, page * size + size);

  if (p.perms?.view && !can(p.perms.view)) return <><PageHeader title={p.title} description={p.description} /><NoAccess /></>;
  const exportCols = p.columns.filter((c) => c.key !== "_").map((c) => ({ key: c.key, label: c.label }));
  const save = (v: Record<string, any>) => {
    const data = p.transform ? p.transform(v) : v;
    if (editing === "new") { dataApi.create(p.collection, { ...(p.defaults ?? {}), ...data, ...(collegeId ? { college_id: collegeId } : {}) }, p.module); toast.success(`${singular} created`); }
    else if (editing) { dataApi.update(p.collection, editing.id, data, p.module); toast.success(`${singular} updated`); }
    setEditing(null);
  };
  const onImport = async (file: File) => {
    const parsed = parseCSV(await file.text());
    const valid = parsed.filter((r) => p.fields?.filter((f) => f.required).every((f) => r[f.name]));
    if (!valid.length) return toast.error("No valid rows found. Use the exported column names as headers.");
    dataApi.bulkCreate(p.collection, valid.map((r) => ({ ...(p.defaults ?? {}), ...r, ...(collegeId ? { college_id: collegeId } : {}) })), p.module);
    toast.success(`Imported ${valid.length} of ${parsed.length} rows`);
  };
  const hasRowMenu = (p.fields && p.perms?.edit && can(p.perms.edit)) || (p.perms?.delete && can(p.perms.delete)) || p.rowActions?.some((a) => can(a.perm));
  const canDelete = p.perms?.delete && can(p.perms.delete);

  return (
    <div>
      <PageHeader title={p.title} description={p.description} actions={<>
        {p.headerExtra}
        {p.perms?.import && can(p.perms.import) && <><input ref={fileRef} type="file" accept=".csv" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onImport(f); e.target.value = ""; }} /><Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}><Upload />Import CSV</Button></>}
        {(!p.perms?.export || can(p.perms.export)) && <Button variant="outline" size="sm" onClick={() => { downloadCSV(p.collection, toCSV(rows, exportCols)); toast.success(`Exported ${rows.length} rows`); }}><Download />Export</Button>}
        {p.fields && p.perms?.create && can(p.perms.create) && <Button size="sm" onClick={() => setEditing("new")}><Plus />Add {singular.toLowerCase()}</Button>}
      </>} />
      {p.above}
      <div className="surface overflow-hidden">
        <div className="flex flex-col gap-2 border-b p-3 md:flex-row md:items-center">
          <div className="relative md:w-72"><Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder={`Search ${p.title.toLowerCase()}…`} className="h-9 pl-8" /></div>
          <div className="flex flex-wrap gap-2">
            {p.filters?.map((f) => (
              <Select key={f.key} value={flt[f.key] ?? "all"} onValueChange={(v) => { setFlt((s) => ({ ...s, [f.key]: v })); setPage(0); }}>
                <SelectTrigger className="h-9 min-w-36"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All {f.label.toLowerCase()}</SelectItem>{f.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>))}
          </div>
          {sel.length > 0 && canDelete && <Button variant="outline" size="sm" className="md:ml-auto text-destructive" onClick={() => setDeleting(sel)}><Trash2 />Delete {sel.length}</Button>}
        </div>
        {view.length === 0 ? <EmptyState title={all.length ? "No matching records" : `No ${p.title.toLowerCase()} yet`} description={all.length ? "Try a different search or clear filters." : undefined} /> : (
          <Table>
            <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40">
              {canDelete && <TableHead className="w-10"><Checkbox checked={view.every((r) => sel.includes(r.id))} onCheckedChange={(c) => setSel(c ? [...new Set([...sel, ...view.map((r) => r.id)])] : sel.filter((id) => !view.some((r) => r.id === id)))} /></TableHead>}
              {p.columns.map((c) => <TableHead key={c.key} className={cn("text-xs font-medium text-muted-foreground", c.hideOnMobile && "hidden md:table-cell", c.className)}>
                {c.sortable !== false && c.key !== "_" ? <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => setSort((s) => ({ key: c.key, dir: s?.key === c.key && s.dir === 1 ? -1 : 1 }))}>{c.label}<ArrowUpDown className="size-3 opacity-50" /></button> : c.label}
              </TableHead>)}
              {hasRowMenu && <TableHead className="w-10" />}
            </TableRow></TableHeader>
            <TableBody>{view.map((r) => (
              <TableRow key={r.id} data-state={sel.includes(r.id) ? "selected" : undefined}>
                {canDelete && <TableCell><Checkbox checked={sel.includes(r.id)} onCheckedChange={(c) => setSel(c ? [...sel, r.id] : sel.filter((x) => x !== r.id))} /></TableCell>}
                {p.columns.map((c) => <TableCell key={c.key} className={cn("text-sm", c.hideOnMobile && "hidden md:table-cell", c.className)}>{c.render ? c.render(r) : String(r[c.key] ?? "—") || "—"}</TableCell>)}
                {hasRowMenu && <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8" aria-label="Row actions"><MoreHorizontal /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {p.rowActions?.filter((a) => can(a.perm) && !a.hidden?.(r)).map((a) => <DropdownMenuItem key={a.label} onClick={() => a.onClick(r)}>{a.icon && <a.icon />}{a.label}</DropdownMenuItem>)}
                    {p.fields && p.perms?.edit && can(p.perms.edit) && <DropdownMenuItem onClick={() => setEditing(r)}><Pencil />Edit</DropdownMenuItem>}
                    {canDelete && <><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleting([r.id])}><Trash2 />Delete</DropdownMenuItem></>}
                  </DropdownMenuContent></DropdownMenu></TableCell>}
              </TableRow>))}
            </TableBody>
          </Table>)}
        <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
          <span>{rows.length} record{rows.length === 1 ? "" : "s"}</span>
          <div className="flex items-center gap-2"><span>Page {page + 1} of {pages}</span>
            <Button variant="outline" size="icon" className="size-7" disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Previous page"><ChevronLeft /></Button>
            <Button variant="outline" size="icon" className="size-7" disabled={page >= pages - 1} onClick={() => setPage(page + 1)} aria-label="Next page"><ChevronRight /></Button></div>
        </div>
      </div>
      {p.fields && <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editing === "new" ? `Add ${singular.toLowerCase()}` : `Edit ${singular.toLowerCase()}`}</DialogTitle><DialogDescription>Changes sync to the mobile app for this college.</DialogDescription></DialogHeader>
          {editing && <RecordForm fields={p.fields} defaults={editing === "new" ? (p.defaults ?? {}) : editing} onSubmit={save} onCancel={() => setEditing(null)} submitLabel={editing === "new" ? "Create" : "Save changes"} />}
        </DialogContent></Dialog>}
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete {deleting?.length} record{deleting?.length === 1 ? "" : "s"}?</AlertDialogTitle><AlertDialogDescription>This removes the data from the mobile app too. This action is recorded in the audit log.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { dataApi.remove(p.collection, deleting!, p.module); setSel([]); toast.success("Deleted"); }}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
