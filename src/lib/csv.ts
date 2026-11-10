export function toCSV(rows: Record<string, any>[], cols: { key: string; label: string }[]) {
  const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.map((c) => esc(c.label)).join(","), ...rows.map((r) => cols.map((c) => esc(r[c.key])).join(","))].join("\n");
}
export function downloadCSV(name: string, csv: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a"); a.href = url; a.download = `${name}.csv`; a.click(); URL.revokeObjectURL(url);
}
export function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/); if (lines.length < 2) return [];
  const split = (l: string) => (l.match(/("([^"]|"")*"|[^,]*)(,|$)/g) ?? []).map((x) => x.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"').trim()).slice(0, -1).concat([]);
  const head = split(lines[0]).map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return lines.slice(1).filter(Boolean).map((l) => { const v = split(l); return Object.fromEntries(head.map((h, i) => [h, v[i] ?? ""])); });
}
