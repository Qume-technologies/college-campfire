import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/components/app/resource-page";
import { StatusBadge } from "@/components/app/ui-bits";
import { DEPARTMENTS } from "@/lib/mock-data";
export const Route = createFileRoute("/college/leave-management")({ head: () => ({ meta: [{ title: "Leave requests — CampusOS" }] }), component: () => (
  <ResourcePage title="Leave requests" description="Review student leave applications." collection="leaves" module="Leave requests" searchKeys={["student_name","student_id"]} perms={{view:"leave.view",edit:"leave.review"}} filters={[{key:"status",label:"Statuses",options:["Pending","Approved","Rejected"]}]} columns={[{key:"student_name",label:"Student"},{key:"subject",label:"Reason"},{key:"start_date",label:"From"},{key:"end_date",label:"To"},{key:"status",label:"Status",render:(r:any)=><StatusBadge status={r.status}/>}]} fields={[{name:"status",label:"Status",type:"select",options:["Pending","Approved","Rejected"]},{name:"admin_reply",label:"Reply",type:"textarea"}]} />) });
void StatusBadge; void DEPARTMENTS;
