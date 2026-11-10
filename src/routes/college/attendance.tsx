import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/components/app/resource-page";
import { StatusBadge } from "@/components/app/ui-bits";
import { DEPARTMENTS } from "@/lib/mock-data";
export const Route = createFileRoute("/college/attendance")({ head: () => ({ meta: [{ title: "Attendance — CampusOS" }] }), component: () => (
  <ResourcePage title="Attendance" description="Monthly attendance per student (mobile app format)." collection="attendance" module="Attendance" searchKeys={["student_id","month_name"]} perms={{view:"attendance.view",create:"attendance.mark",edit:"attendance.edit",delete:"attendance.edit"}} filters={[{key:"month_name",label:"Months",options:["Jun 2026","Jul 2026","Aug 2026","Sep 2026","Oct 2026","Nov 2026"]}]} columns={[{key:"student_id",label:"Student ID"},{key:"month_name",label:"Month"},{key:"present_days",label:"Present"},{key:"total_days",label:"Total"},{key:"_",label:"Percent",sortable:false,render:(r:any)=>`${Math.round(r.present_days/Math.max(1,r.total_days)*100)}%`}]} fields={[{name:"student_id",label:"Student ID",required:true},{name:"month_name",label:"Month",required:true,placeholder:"Nov 2026"},{name:"present_days",label:"Present days",type:"number",min:0},{name:"total_days",label:"Total days",type:"number",min:0}]} />) });
void StatusBadge; void DEPARTMENTS;
