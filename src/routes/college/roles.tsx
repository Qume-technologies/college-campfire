import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/components/app/resource-page";
import { StatusBadge } from "@/components/app/ui-bits";
import { DEPARTMENTS } from "@/lib/mock-data";
export const Route = createFileRoute("/college/roles")({ head: () => ({ meta: [{ title: "Roles — CampusOS" }] }), component: () => (
  <ResourcePage title="Roles" description="College roles. Edit permissions on the Permissions page." collection="roles" module="Roles" searchKeys={["name"]} perms={{view:"settings.roles",create:"settings.roles",edit:"settings.roles",delete:"settings.roles"}} defaults={{permissions:[],system:false}} columns={[{key:"name",label:"Role"},{key:"description",label:"Description",hideOnMobile:true},{key:"_",label:"Permissions",sortable:false,render:(r:any)=>r.permissions.length}]} fields={[{name:"name",label:"Name",required:true},{name:"description",label:"Description",type:"textarea"}]} />) });
void StatusBadge; void DEPARTMENTS;
