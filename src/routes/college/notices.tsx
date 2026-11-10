import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/components/app/resource-page";
import { StatusBadge } from "@/components/app/ui-bits";
import { DEPARTMENTS } from "@/lib/mock-data";
export const Route = createFileRoute("/college/notices")({ head: () => ({ meta: [{ title: "Notices — CampusOS" }] }), component: () => (
  <ResourcePage title="Notices" description="Announcements shown in the mobile app." collection="notices" module="Notices" searchKeys={["title"]} perms={{view:"notices.view",create:"notices.create",edit:"notices.edit",delete:"notices.delete"}} defaults={{status:"Published"}} columns={[{key:"title",label:"Title"},{key:"department",label:"Audience",render:(r:any)=>r.department||"Whole college"},{key:"created_at",label:"Date"},{key:"status",label:"Status",render:(r:any)=><StatusBadge status={r.status}/>}]} fields={[{name:"title",label:"Title",required:true},{name:"department",label:"Department",type:"select",options:DEPARTMENTS},{name:"room_no",label:"Section"},{name:"status",label:"Status",type:"select",options:["Published","Scheduled"]},{name:"content",label:"Content",type:"textarea",required:true}]} />) });
void StatusBadge; void DEPARTMENTS;
