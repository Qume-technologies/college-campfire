import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/components/app/resource-page";
import { StatusBadge } from "@/components/app/ui-bits";
import { DEPARTMENTS } from "@/lib/mock-data";
export const Route = createFileRoute("/college/audit-logs")({ head: () => ({ meta: [{ title: "Audit logs — CampusOS" }] }), component: () => (
  <ResourcePage title="Audit logs" description="Sensitive actions in your college." collection="audit" module="Audit logs" searchKeys={["user","action","module"]} perms={{view:"audit.view"}} columns={[{key:"created_at",label:"Time"},{key:"user",label:"User"},{key:"action",label:"Action"},{key:"module",label:"Module"},{key:"record",label:"Record"}]} />) });
void StatusBadge; void DEPARTMENTS;
