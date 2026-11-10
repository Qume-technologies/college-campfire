import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/components/app/resource-page";
import { StatusBadge } from "@/components/app/ui-bits";
import { DEPARTMENTS } from "@/lib/mock-data";
export const Route = createFileRoute("/college/notifications")({ head: () => ({ meta: [{ title: "Notifications — CampusOS" }] }), component: () => (
  <ResourcePage title="Notifications" description="Targeted alerts for students." collection="notifications" module="Notifications" searchKeys={["title"]} perms={{view:"notices.create",create:"notices.create",delete:"notices.delete"}} columns={[{key:"title",label:"Title"},{key:"student_id",label:"Student"},{key:"department",label:"Department"},{key:"created_at",label:"Sent"}]} fields={[{name:"title",label:"Title",required:true},{name:"student_id",label:"Student ID (blank = broadcast)"},{name:"department",label:"Department",type:"select",options:DEPARTMENTS},{name:"content",label:"Message",type:"textarea",required:true}]} />) });
void StatusBadge; void DEPARTMENTS;
