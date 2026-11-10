import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/components/app/resource-page";
import { StatusBadge } from "@/components/app/ui-bits";
import { DEPARTMENTS } from "@/lib/mock-data";
export const Route = createFileRoute("/college/departments")({ head: () => ({ meta: [{ title: "Departments — CampusOS" }] }), component: () => (
  <ResourcePage title="Departments" description="Academic departments of your college." collection="departments" module="Departments" searchKeys={["name","code"]} perms={{view:"settings.departments",create:"settings.departments",edit:"settings.departments",delete:"settings.departments"}} columns={[{key:"code",label:"Code"},{key:"name",label:"Name"},{key:"head",label:"Head"},{key:"programs",label:"Programs",hideOnMobile:true}]} fields={[{name:"name",label:"Name",required:true},{name:"code",label:"Code",required:true},{name:"head",label:"Head"},{name:"programs",label:"Programs"}]} />) });
void StatusBadge; void DEPARTMENTS;
