import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/components/app/resource-page";
import { StatusBadge } from "@/components/app/ui-bits";
import { DEPARTMENTS } from "@/lib/mock-data";
export const Route = createFileRoute("/super-admin/roles")({ head: () => ({ meta: [{ title: "Platform roles — CampusOS" }] }), component: () => (
  <ResourcePage title="Platform roles" description="Roles across all colleges." collection="roles" module="Platform roles" scoped={false} searchKeys={["name"]} columns={[{key:"name",label:"Role"},{key:"college_id",label:"College"},{key:"description",label:"Description"}]} />) });
void StatusBadge; void DEPARTMENTS;
