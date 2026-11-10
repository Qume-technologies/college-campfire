import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/components/app/resource-page";
import { StatusBadge } from "@/components/app/ui-bits";
import { DEPARTMENTS } from "@/lib/mock-data";
export const Route = createFileRoute("/super-admin/colleges")({ head: () => ({ meta: [{ title: "Colleges — CampusOS" }] }), component: () => (
  <ResourcePage title="Colleges" description="All tenant colleges." collection="colleges" module="Colleges" scoped={false} searchKeys={["name","code","city"]} filters={[{key:"status",label:"Statuses",options:["Pending","Under Review","Approved","Suspended","Rejected"]}]} perms={{create:"x",edit:"x"}} columns={[{key:"code",label:"ID"},{key:"name",label:"College"},{key:"city",label:"City",hideOnMobile:true},{key:"plan",label:"Plan"},{key:"created_at",label:"Registered",hideOnMobile:true},{key:"status",label:"Status",render:(r:any)=><StatusBadge status={r.status}/>}]} fields={[{name:"name",label:"Name",required:true},{name:"email",label:"Email",type:"email",required:true},{name:"city",label:"City"},{name:"status",label:"Status",type:"select",options:["Pending","Under Review","Approved","Suspended","Rejected"]},{name:"plan",label:"Plan",type:"select",options:["Free Trial","Basic","Professional","Enterprise"]}]} />) });
void StatusBadge; void DEPARTMENTS;
