import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/components/app/resource-page";
import { StatusBadge } from "@/components/app/ui-bits";
import { DEPARTMENTS } from "@/lib/mock-data";
export const Route = createFileRoute("/super-admin/users")({ head: () => ({ meta: [{ title: "Platform users — CampusOS" }] }), component: () => (
  <ResourcePage title="Platform users" description="SaaS staff accounts." collection="platform_users" module="Platform users" scoped={false} searchKeys={["full_name","email"]} perms={{create:"x",edit:"x",delete:"x"}} columns={[{key:"full_name",label:"Name"},{key:"email",label:"Email"},{key:"role",label:"Role"},{key:"status",label:"Status",render:(r:any)=><StatusBadge status={r.status}/>}]} fields={[{name:"full_name",label:"Name",required:true},{name:"email",label:"Email",type:"email",required:true},{name:"role",label:"Role",type:"select",options:["Super Admin","Support","Billing","Reviewer"]}]} />) });
void StatusBadge; void DEPARTMENTS;
