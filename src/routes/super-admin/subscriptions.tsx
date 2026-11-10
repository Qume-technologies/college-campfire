import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/components/app/resource-page";
import { StatusBadge } from "@/components/app/ui-bits";
import { DEPARTMENTS } from "@/lib/mock-data";
export const Route = createFileRoute("/super-admin/subscriptions")({ head: () => ({ meta: [{ title: "Subscriptions — CampusOS" }] }), component: () => (
  <ResourcePage title="Subscriptions" description="Plans and limits." collection="plans" module="Subscriptions" scoped={false} searchKeys={["name"]} perms={{create:"x",edit:"x"}} columns={[{key:"name",label:"Plan"},{key:"price",label:"Price (Rs)"},{key:"period",label:"Period"},{key:"students",label:"Students"},{key:"storage",label:"Storage"}]} fields={[{name:"name",label:"Name",required:true},{name:"price",label:"Price",type:"number",min:0},{name:"period",label:"Period"},{name:"students",label:"Student limit",type:"number"},{name:"storage",label:"Storage"}]} />) });
void StatusBadge; void DEPARTMENTS;
